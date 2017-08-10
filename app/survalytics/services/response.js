'use strict';
import { AsyncStorage } from 'react-native';

const uuidv4 = require('uuid/v4');

import { GetDeviceInfo, GetLocalInfo } from './device';
import { APPLICATION_VERSION, APPLICATION_NAMESPACE } from '../config/constants';


export const NewResponse = (id, json, uploaded) => {
    var p = new Promise( (resolve, reject) => {
        var result = {};
        result.id = id;

        if (typeof json == "string") {
            result.json = JSON.parse(json) || {};
        } else {
            result.json = JSON.parse(JSON.stringify(json)) || {};
        }
        
        result.uploaded = uploaded;

        if (typeof result.json.userguid_str == "undefined") {
            _addHeader(result.json)
                .then( (data) => {
                    result.json = JSON.parse(JSON.stringify(data));
                    resolve(result);
                })
                .catch( (err) => {
                    // TODO: Need to fix: ignores error
                    resolve(null);
                });
        } else {
            resolve(result);
        }
    });
    return p;
};


export const NewResponseFromQuestion = (q) => {
    var p = new Promise( (resolve, reject) => {
        var response_json = {};
        response_json.entrytype_str = "survey";
        response_json.surveyguid_str = q.json_str.surveyguid_str;
        response_json.questionguid_str = q.questionguid_str;
        response_json.questionprompt_str = q.json_str.questionprompt_str;
        response_json.response_str = q.final_response_str;
        response_json.responseid_int = q.final_responseid_int;

        if (q.json_str.questiontype_str == 'TYPE_CHECKBOXES') {
            response_json.responses_arr = q.final_response_str;
        }

        NewResponse(null, response_json, 0)
            .then( (response) => {
                resolve(response);
            })
            .catch( (err) => {
                reject(null);
            })
    });
    return p;
};


export const CloneResponse = (r) => {
    var p = new Promise( (resolve, reject) => {
        resolve(JSON.parse(JSON.stringify(r)));
    });
    return p;
}


const _addHeader = async (json) => {
    var p = new Promise( (resolve, reject) => {
        Promise.all([AsyncStorage.getItem('@UserGUID_Str'), GetLocalInfo(), GetDeviceInfo()])
            .then((data) => {
                var result = JSON.parse(JSON.stringify(json));
                result.userguid_str = data[0] || "UNDEFINED";
                result.application_version = APPLICATION_VERSION;
                result.application_namespace_str = APPLICATION_NAMESPACE;
                var newresult = Object.assign({}, result, data[1], data[2]);
                resolve(newresult);
            })
            .catch( (err) => {
                // TODO: Need to fix: ignores error
                resolve(null);
            });
    });
    return p;
};


export const SetUserGUID = () => {
    var p = new Promise( (resolve, reject) => {
        AsyncStorage.getItem('@UserGUID_Str')
            .then( (data) => {
                if (data) {
                    resolve(true)
                }

                return AsyncStorage.setItem('@UserGUID_Str', uuidv4());
            })
            .then( () => {
                resolve(true);
            })
            .catch( (err) => {
                reject(err);
            });
    });
    return p;
}