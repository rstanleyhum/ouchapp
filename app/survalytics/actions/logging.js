'use strict';

import { InsertResponse } from '../services/localdb';
import { NewResponse } from '../services/response';


export const SET_LOGVALUE = 'SET_LOGVALUE';

export const LOG_TYPE_ERROR = 'ERROR'
export const LOG_TYPE_INFO  = 'INFO'

export function logError(functionName, errorMsg) {
    return (dispatch) => {
        
        var response_json = {
            functionName: functionName,
            logType: LOG_TYPE_ERROR,
            msg: errorMsg
        }

        NewResponse(null, response_json, 0)
            .then( (r) => {
                return InsertResponse(r);
            })
            .catch( (err) => {
                // TODO: Need to fix: ignores errors
            });
    }
}

export function logInfo(functionName, infoMsg) {
    return (dispatch) => {
        var response_json = {
            functionName: functionName,
            logType: LOG_TYPE_INFO,
            msg: infoMsg
        }

        NewResponse(null, response_json, 0)
            .then( (r) => {
                return InsertResponse(r);
            })
            .catch( (err) => {
                // TODO: Need to fix: ignores errors
            });
    }
}