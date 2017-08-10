'use strict';

import { SQLite } from 'expo';

import { NewResponse } from './response';
import { NewQuestion, IsConditional, IsRelevantConditionalQuestion } from './question';


const CREATE_QUESTION_TABLE_SQL = `CREATE TABLE IF NOT EXISTS questionlist (
    ordinalposition_int INTEGER PRIMARY KEY, 
    questionguid_str TEXT,
    json_str TEXT,
    final_responseid_int, INTEGER,
    final_response_str TEXT,
    ongoingquestion_int INTEGER,
    answered_int INTEGER,
    uploaded_int INTEGER);
`;

const CREATE_RESPONSE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS responsestoupload (
    _id INTEGER PRIMARY KEY AUTOINCREMENT,
    json TEXT,
    uploaded INTEGER);
`;

const INSERT_RESPONSES_SQL = `INSERT INTO responsestoupload (json, uploaded ) VALUES (?, ?);`;

const SELECT_RESPONSES_TOUPLOAD_SQL = `SELECT * FROM responsestoupload WHERE uploaded = 0;`;

const DELETE_REPSONSE_BY_ID_SQL = `DELETE FROM responsestoupload WHERE _id = ?;`;

const DELETE_ALL_RESPONSES_SQL = `DELETE FROM responsestoupload;`;

const SELECT_QUESTION_BY_GUID_SQL = `SELECT * FROM questionlist WHERE questionguid_str = ?;`;

const SELECT_ALL_QUESTIONS_SQL = `SELECT * FROM questionlist;`;

const INSERT_QUESTION_SQL = `INSERT INTO questionlist 
    (ordinalposition_int, questionguid_str, json_str, final_responseid_int, final_response_str, ongoingquestion_int, answered_int, uploaded_int)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

const SELECT_NEXT_UNANSWERED_QUESTION_SQL = `SELECT * FROM questionlist WHERE answered_int = 0 ORDER BY ordinalposition_int;`;

const DELETE_QUESTION_BY_ORDINALPOSITION_SQL = `DELETE FROM questionlist WHERE ordinalposition_int = ?;`;

const DELETE_QUESTION_BY_QUESTIONGUID_SQL = `DELETE FROM questionlist WHERE questionguid_str = '?';`;

const DELETE_ALL_QUESTIONS_SQL = `DELETE FROM questionlist;`;

const UPDATE_QUESTION_BY_QUESTIONGUID_SQL = `UPDATE questionlist 
    SET ordinalposition_int = ?, json_str = ?, final_responseid_int = ?, final_response_str = ?, ongoingquestion_int = ?, answered_int = ?, uploaded_int = ?
    WHERE questionguid_str = ?;`;

const db = SQLite.openDatabase({name: 'questions.db3'});


export const SetupLocalDB = () => {
    var p = new Promise( (resolve, reject) => {
            db.transaction(
            tx => {
                tx.executeSql(CREATE_QUESTION_TABLE_SQL, [], () => {}, () => {reject("ERROR: (SetupLocalDB - CREATE_QUESTION_TABLE_SQL):")} );
                tx.executeSql(CREATE_RESPONSE_TABLE_SQL, [], () => {}, () => {reject("ERROR: (SetupLocalDB - CREATE_RESPONSE_TABLE_SQL):")} );
            },
            (err) => {
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );
    });
    return p;
};


export const InsertQuestion = (q) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            q.ordinalposition_int,
            q.questionguid_str,
            JSON.stringify(q.json_str),
            q.final_responseid_int,
            q.final_response_str,
            q.ongoingquestion_int || 0,
            q.answered_bool,
            q.uploaded_int || 0
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_QUESTION_SQL, args, () => {
                    resolve(true);
                },
                (tx, err) => {
                    // TODO: Need to fix: ignores error
                    resolve(false);
                })
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );

    });
    return p;
};


export const UpdateQuestion = (q) => {
    var p = new Promise( (resolve, reject) => {
        let args = [
            q.ordinalposition_int,
            JSON.stringify(q.json_str),
            q.final_responseid_int,
            q.final_response_str,
            q.ongoingquestion_int || 0,
            q.answered_bool,
            q.uploaded_int || 0,
            q.questionguid_str
        ];
        db.transaction(
            tx => {
                tx.executeSql(UPDATE_QUESTION_BY_QUESTIONGUID_SQL, args, () => {
                    resolve(true);
                },
                (tx, err) => {
                    //TODO: Need to fix: ignores error
                    resolve(false);
                })
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );

    });
    return p;
};


export const UpdateQuestions = (questions) => {
    var p = new Promise( (resolve, reject) => {
        let processes = questions.map( (q, idx) => {
            return UpdateQuestion(q);
        });
        Promise.all(processes)
            .then( (data) => {
                resolve(true);
            })
            .catch( (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            }); 
    });
    return p;
};


export const InsertQuestions = (questions) => {
    var p = new Promise( (resolve, reject) => {
        let processes = questions.map( (q, idx) => {
            return InsertQuestion(q);
        });
        Promise.all(processes)
            .then( (data) => {
                resolve(true);
            })
            .catch( (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            }); 
    });
    return p;
};


export const GetAllQuestions = () => {
    var p = new Promise( (resolve, reject) => {
        var questions = [];
        db.transaction(
            tx => {
                tx.executeSql(SELECT_ALL_QUESTIONS_SQL, [], (tx, rs) => {
                    var create_questions = rs.rows._array.map( async (data, idx) => {
                        return NewQuestion(data.questionguid_str, data.json_str, data.ordinalposition_int, data.final_responseid_int, data.final_response_str, data.ongoingquestion_int, data.answered_int, data.uploaded_int);
                    });
                    questions = Promise.all(create_questions);
                },
                (tx, err) => {
                    //TODO: Need to fix: ignores error
                })
            },
            (err) => {
                //TODO: Need to fix: ignores error
                reject([]);
            },
            () => {
                resolve(questions);
            }
        );
    });
    return p;
};


export const GetQuestion = (guid) => {
    var p = new Promise( (resolve, reject) => {
        var result = {};
        var success = false;
        var args = [
            guid
        ];
        db.transaction(
            tx => {
                tx.executeSql(SELECT_QUESTION_BY_GUID_SQL, args, (tx, rs) => {
                        if (rs.rows.length > 1) {
                            success = false;
                            //TODO: Need to fix: ignores error
                            resolve(null);
                        }
                        
                        if (rs.rows.length == 0) {
                            success = false;
                            //TODO: Need to fix: ignores error
                            resolve(null);
                        }

                        if (rs.rows.length == 1) {
                            success = true;
                            result = rs.rows.item(0)
                        }
                    },
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                        resolve(null);
                    }
                );
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(null);
            },
            () => {
                if (!success) {
                    //TODO: Need to fix: ignores error
                    resolve(null);
                }

                var item2 = result;
                
                NewQuestion(
                    item2.questionguid_str,
                    item2.json_str,
                    item2.ordinalposition_int,
                    item2.final_responseid_int,
                    item2.final_response_str,
                    item2.answered_int
                )
                .then( (q) => {
                    resolve(q);
                })
                .catch( (err) => {
                    //TODO: Need to fix: ignores error
                    resolve(null);
                });
            }
        );
    });
    return p;
};


export const DeleteQuestions = (questions) => {
    var questionguids = questions.map( (q, idx) => {
        return q.questionguid_str;
    });
    return DeleteQuestionsByGuid(questionguids);
};


export const DeleteQuestionByGuid = (guid) => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(DELETE_QUESTION_BY_QUESTIONGUID_SQL, [], () => {},
                    (tx, err) => {
                        //TODO: Need to fix: ignores error
                    });
                (err) => {
                    //TODO: Need to fix: ignores error
                    resolve(false);
                },
                () => {
                    resolve(true);
                }
            }
        )
    });
    return p;
};


export const DeleteQuestionsByGuid = (questionguids) => {
    var p = new Promise( (resolve, reject) => {
        let processes = questionguids.map( (guid, idx) => {
            return DeleteQuestionByGuid(guid);
        });

        Promise.all(processes)
            .then( () => {
                resolve(true);
            })
            .catch( (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            });
    });
    return p;
};


export const DeleteAllQuestions = () => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(DELETE_ALL_QUESTIONS_SQL, [], () => {},
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                    });
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );
    });
    return p;
};


export const GetNextUnansweredQuestion = () => {
    var p = new Promise( (resolve, reject) => {
        var row_results;
        db.transaction(
            tx => {
                tx.executeSql(SELECT_NEXT_UNANSWERED_QUESTION_SQL, [], (tx, rs) => {
                        if (rs.rows._array) {
                            row_results = JSON.parse(JSON.stringify(rs.rows._array));
                        };
                    },
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                    }
                );
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(null);
            },
            () => { 
                var found = false;
                var num_results = row_results.length;
                let print_questions = row_results.map( (itemx, idx) => {
                    return itemx.questionguid_str;
                })

                let create_questions = row_results.map( (item1, idx) => {
                    return NewQuestion(
                        item1.questionguid_str,
                        item1.json_str,
                        item1.ordinalposition_int,
                        item1.final_responseid_int,
                        item1.final_response_str,
                        item1.answered_int
                    );
                });
                Promise.all(create_questions)
                    .then( (questions) => {
                        let create_isconditional = questions.map( (q, idx) => {
                            return IsConditional(q);
                        });
                        let create_isrelevant = questions.map( (q, idx) => {
                            return IsRelevantConditionalQuestion(q);
                        });
                        return Promise.all([questions, Promise.all(create_isconditional), Promise.all(create_isrelevant)]);
                    })
                    .then( (results) => {
                        let questions = results[0];
                        let isconditional = results[1];
                        let isrelevant = results[2];
                        let num_results = questions.length;
                        for (let i = 0; i < num_results; i++) {
                            if (!isconditional[i]) {
                                resolve(questions[i]);
                            }

                            if (isrelevant[i]) {
                                resolve(questions[i]);
                            }
                        }
                        resolve(null);
                    })
                    .catch( (err) => {
                        //TODO: Need to fix: ignores error
                        resolve(null);
                    });
            }
        );
    });
    return p;
};


export const InsertResponse = (r) => {
    var p = new Promise( (resolve, reject) => {
        var args = [
            JSON.stringify(r.json),
            r.uploaded
        ];
        db.transaction(
            tx => {
                tx.executeSql(INSERT_RESPONSES_SQL, args, () => {},
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                    });
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );
    });
    return p;
}


export const InsertResponses = (responses) => {
     var p = new Promise( (resolve, reject) => {
         let processes = responses.map( (r, idx) => {
             return InsertResponse(r);
         });

         Promise.all(processes)
            .then( () => {
                resolve(true);
            })
            .catch( (err) => {
                //TODO: Need to fix: ignores error
                reject(false);
            });
     });
     return p;
};


export const GetResponsesToUpload = () => {
    var p = new Promise( (resolve, reject) => {
        var responses = [];
        db.transaction(
            tx => {
                tx.executeSql(SELECT_RESPONSES_TOUPLOAD_SQL, [], (tx, rs) => {
                    var create_responses = rs.rows._array.map( (data, idx) => {
                        return NewResponse(data._id, data.json, data.uploaded);
                    });
                    responses = Promise.all(create_responses);
                },
                (_, err) => {
                    //TODO: Need to fix: ignores error
                });
            },
            (err) => {
                //TODO: Need to fix: ignores error
                reject(err);
            },
            () => { 
                resolve(responses);
            });
    });
    return p;
};


export const DeleteResponseByID = (rid) => {
    var p = new Promise( (resolve, reject) => {
        var args = [rid];
        db.transaction(
            tx => {
                tx.executeSql(DELETE_REPSONSE_BY_ID_SQL, args, () => {},
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                });
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            });
    });
    return p;
};


export const DeleteResponses = (responses) => {
    var p = new Promise( (resolve, reject) => {
        let processes = responses.map( (r, idx) => {
            return DeleteResponseByID(r.id);
        });

        Promise.all(processes)
            .then( () => {
                resolve(true);
            })
            .catch( () => {
                resolve(false);
            });
    });
    return p;
};


export const DeleteAllResponses = () => {
    var p = new Promise( (resolve, reject) => {
        db.transaction(
            tx => {
                tx.executeSql(DELETE_ALL_RESPONSES_SQL, [], () => {}, 
                    (_, err) => {
                        //TODO: Need to fix: ignores error
                    } );
            },
            (err) => {
                //TODO: Need to fix: ignores error
                resolve(false);
            },
            () => {
                resolve(true);
            }
        );
    });
    return p;
};
