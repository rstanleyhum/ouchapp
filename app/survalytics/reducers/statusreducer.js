'use strict';

import { SET_SKIPPED_SURVEY } from '../actions/questions';
import { 
    SET_DELETING_ALL_QUESTIONS,
    SET_DOWNLOADING_SURVEY,
    SET_HAS_NEW_QUESTIONS,
    SET_HAS_SERVER_ERROR,
    SET_LOADING_QUESTION,
    SET_UPLOADING_RESPONSES,
    SET_SUBMITTING_RESPONSE
} from '../actions/status';
import { SET_LOGVALUE } from '../actions/logging';


const initialState = {
    skippedSurvey: false,
    deletingQuestions: false,
    downloadingSurvey: false,
    hasNewQuestions: false,
    hasServerError: false,
    loadingQuestion: false,
    uploadingResponses: false,
    submittingResponse: false,
    logValueString: ""
}


function StatusReducer(state = initialState, action) {
    
    switch(action.type) {

        case SET_SKIPPED_SURVEY:
            return Object.assign({}, state, {
                skippedSurvey: action.value
            });

        case SET_DELETING_ALL_QUESTIONS:
            return Object.assign({}, state, {
                deletingQuestions: action.value
            });

        case SET_HAS_NEW_QUESTIONS:
            return Object.assign({}, state, {
                hasNewQuestions: action.value
            });

        case SET_HAS_SERVER_ERROR:
            return Object.assign({}, state, {
                hasServerError: action.value
            });

        case SET_LOADING_QUESTION:
            return Object.assign({}, state, {
                loadingQuestion: action.value
            });

        case SET_UPLOADING_RESPONSES:
            return Object.assign({}, state, {
                uploadingResponses: action.value
            });

        case SET_SUBMITTING_RESPONSE:
            return Object.assign({}, state, {
                submittingResponse: action.value
            });

        case SET_LOGVALUE:
            var logValueString = [action.functionName, action.logType, action.msg].join("::");
            return Object.assign({}, state, {
                logValueString: logValueString
            });

        default:
            return state;
    }
}

export default StatusReducer