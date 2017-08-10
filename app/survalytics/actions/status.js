'use strict';

export const SET_DELETING_ALL_QUESTIONS = 'SET_DELETING_ALL_QUESTIONS';
export const SET_DOWNLOADING_SURVEY = 'SET_DOWNLOADING_SURVEY';
export const SET_HAS_NEW_QUESTIONS = 'SET_HAS_NEW_QUESTIONS';
export const SET_HAS_SERVER_ERROR = 'SET_HAS_SERVER_ERROR';
export const SET_LOADING_QUESTION = 'SET_LOADING_QUESTION';
export const SET_UPLOADING_RESPONSES = 'SET_UPLOADING_RESPONSES';
export const SET_SUBMITTING_RESPONSE = 'SET_SUBMITTING_RESPONSE';


export function deletingAllQuestions(value) {
    return {
        type: SET_DELETING_ALL_QUESTIONS,
        value: value
    }
};

export function downloadingSurvey(value) {
    return {
        type: SET_DOWNLOADING_SURVEY,
        value: value
    }
};


export function hasNewQuestions(value) {
    return {
        type: SET_HAS_NEW_QUESTIONS,
        value: value
    }
};


export function hasServerError(value) {
    return {
        type: SET_HAS_SERVER_ERROR,
        value: value
    }
};


export function loadingQuestion(value) {
    return {
        type: SET_LOADING_QUESTION,
        value: value
    }
};


export function uploadingResponses(value) {
    return {
        type: SET_UPLOADING_RESPONSES,
        value: value
    }
};


export function submittingResponse(value) {
    return {
        type: SET_SUBMITTING_RESPONSE,
        value: value
    }
}
