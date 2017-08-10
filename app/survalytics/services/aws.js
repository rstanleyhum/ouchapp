'use strict';

import { Location, Constants } from 'expo';
import { AsyncStorage, Platform } from 'react-native';
var AWS = require('aws-sdk/dist/aws-sdk-react-native');

import { IsOnline, GetGeolocation, GetIpApiInfo } from './network';
import { GetAllQuestions, DeleteQuestionsByGuid, DeleteQuestion, GetQuestion, InsertQuestions, GetResponsesToUpload, DeleteResponseByID } from './localdb';
import { NewQuestion, DeleteQuestionGUID } from './question';


var awsConstants = require('../assets/aws.ouchapp.secret.json');

var myCredentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsConstants.IDENTITY_POOL_ID,
    RoleARN: awsConstants.UNAUTH_ROLE_ARN
},{region: awsConstants.AWS_US_EAST1_REGION});


var dynamodb = new AWS.DynamoDB({
    credentials: myCredentials,
    region: awsConstants.AWS_US_WEST2_REGION,
    endpoint: awsConstants.AWS_US_WEST2_ENDPOINT,
    dynamoDbCrc32: false,
    correctClockSkew: true
});

var docclient = new AWS.DynamoDB.DocumentClient({
    service: dynamodb
});



export const Download = (immediate = false) => {
    var p = new Promise( (resolve, reject) => {
        var current_size;

        IsOnline().then( (isConnected) => {
            if (!isConnected) {
                throw false;
            }
            var params = {
                TableName: awsConstants.QUESTIONTABLENAME
            };
            return dynamodb.describeTable(params).promise();

        }).then( async (data) => {
            current_size = data.Table.TableSizeBytes;
            let old_size = parseInt(await AsyncStorage.getItem('@TableSize')) || 0;

            if ((current_size == old_size) && !immediate) {
                throw false;
            }

            var params = {
                TableName: awsConstants.QUESTIONTABLENAME,
                ConsistentRead: true,
                Limit: 10
            };

            var list = [];
            
            return Promise.all([_loadTableItems(params, list), GetAllQuestions()]);
        }).then( async (return_data) => {
            let server_questions_json = return_data[0];
            let local_questions = return_data[1];
            return _processDownloadedData(server_questions_json, local_questions);
        }).then( async (processed_data) => {
            await AsyncStorage.setItem('@TableSize', current_size.toString());
            resolve(true);
        }).catch( (err) => {
            reject("ERROR: Download: " + err);
        });
    });
    return p;
};


const _loadTableItems = (params, list) => {
    var p = new Promise( (resolve, reject) => {
        docclient.scan(params, (err, data) => {
            if (err) {
                reject(null);
            } else {
                Array.prototype.push.apply(list, data.Items);

                if (typeof data.LastEvaluatedKey != "undefined") {
                    params.ExclusiveStartKey = data.LastEvaluatedKey;
                    _loadTableItems(params, list).then( () => {
                        resolve(list);
                    });
                } else {
                    resolve(list);
                }
            }
        })
    });

    return p;
};


const _processDownloadedData = async (server_questions_json, local_questions) => {
    var new_questions_list = [];
    var data = server_questions_json;
    var num_items = data.length;
    
    var delete_question_guids = [];
    
    var local_questions_guids = local_questions.map( (item, idx) => {
        return item.questionguid_str;
    });

    var questions_to_delete = [];

    let create_questions_list = server_questions_json.map( (item, idx) =>{
        return NewQuestion(item.questionguid_str, item.json_str, item.ordinalposition_int);
    });

    return Promise.all(create_questions_list)
        .then( (server_questions) => {
            let create_deletequestions_guids = server_questions.map( (item, idx) => {
                return DeleteQuestionGUID(item);
            });

            let create_new_questions_list = server_questions.map( (item, idx) => {
                if (local_questions_guids.indexOf(item.questionguid_str) >= 0) {
                    return null;
                } else {
                    return item;
                }
            });

            return Promise.all([Promise.resolve(server_questions), Promise.all(create_deletequestions_guids), Promise.resolve(create_new_questions_list)]);
        })
        .then( (results) => {
            let server_questions = results[0];
            let deletequestions_guids = results[1];
            let new_questions_list = results[2];

            let to_delete_guids = deletequestions_guids || [];
            let new_list = new_questions_list || [];

            let final_delete_question_guids = to_delete_guids.filter( (item) => {
                return item;
            });

            let final_new_questions_list = new_list.filter( (item) => {
                return item;
            });

            var p1 = DeleteQuestionsByGuid(final_delete_question_guids);
            var p2 = InsertQuestions(final_new_questions_list);

            return Promise.all([p1, p2]);
        });
};


const _getLocationAsync = () => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
        
        // INFO: Location does not work on Android emulator
        return Promise.resolve(null);
    }
    var p = new Promise( (resolve, reject) => {
        Location.getCurrentPositionAsync({})
            .then( (location) => {
                resolve(location);
            })
            .catch( (err) => {
                resolve(null);
            }); 
    });
    return p;
};


export const Upload = () => {
    var p = new Promise( (resolve, reject) => {
        var responses = [];
        var geodata;

        IsOnline()
            .then( (isConnected) => {

                if (!isConnected) {
                    throw false;
                }
                return _getLocationAsync();
            })
            .then( (location) => {

                return Promise.all([
                    GetResponsesToUpload(),
                    location != null ? GetGeolocation(location.coords.latitude, location.coords.longitude, location.coords.accuracy) : Promise.resolve(null),
                    GetIpApiInfo()
                ]);
            })
            .then( (data) => {

                var responses = data[0];
                var geolocation = data[1] || {};
                var ipapiinfo = data[2] || {};
        
                var putitems = responses.map( (r, idx) => {
                    let item_json = Object.assign({}, r.json, geolocation, ipapiinfo);
                    let item = JSON.stringify(item_json);

                    return {
                        id: r.id,
                        params: {
                            TableName: awsConstants.RESPONSETABLENAME,
                            Item: item_json
                        }
                    };
                });

                var allitems = putitems.map( (item, idx) => {
                    return _putItem(item.id, item.params);
                });

                return Promise.all(allitems);
            })
            .then( (ids_to_delete) => {

                let final_ids_to_delete = ids_to_delete.filter( (item) => {
                    return item;
                });
                                
                var deleting_responses = final_ids_to_delete.map( (item, idx) => {
                    return DeleteResponseByID(item);
                });
                
                return Promise.all(deleting_responses);
            })
            .then( (done) => {
                resolve(true);
            })
            .catch( (err) => {
                var status = "ERROR: (Upload):", err
                reject(status);
            });
    });
    return p;
};

const _putItem = (id, params) => {
    var p = new Promise( (resolve, reject) => {
        docclient.put(params, function(err, data) {
            if (err) {
                // TODO: Need to fix: if there was an error then ignore it
                resolve(null);
            } else {
                resolve(id);
            }
        })
    });
    return p;
}