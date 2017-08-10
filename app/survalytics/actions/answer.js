'use strict';

import { UpdateQuestions, InsertResponse } from '../services/localdb';
import { NewResponseFromQuestion } from '../services/response';
import { setNewQuestion } from './questions';
import { submittingResponse } from './status';
import { uploadResponses } from './survey';

import { logError } from './logging';

export const CHANGE_TEXT_ANSWER = 'CHANGE_TEXT_ANSWER';
export const UPDATE_SLIDER_VALUE = 'UPDATE_SLIDER_VALUE';
export const SET_BUTTONS_ANSWER = 'SET_BUTTONS_ANSWER';
export const CHANGE_CHECKBOX_VALUE = 'CHANGE_CHECKBOX_VALUE';
export const UPDATE_QUESTION_WITH_RESPONSE = "UPDATE_QUESTION_WITH_RESPONSE";
export const CREATE_RESPONSE = 'CREATE_RESPONSE';


export function submitAnswer() {
    return (dispatch, getState) => {
        if (getState().survalytic.status.submittingResponse) {
            return
        }

        dispatch(submittingResponse(true));
        
        dispatch(updateQuestionWithResponse());
    
        return UpdateQuestions([getState().survalytic.currentq.question])
            .then( () => {
                return NewResponseFromQuestion(getState().survalytic.currentq.question);
            })
            .then( (r) => {
                return InsertResponse(r);
            })
            .then(
                () => {
                    return dispatch(setNewQuestion())
                },
                (error) => {
                    // could not insert response so no new questions
                    return Promise.resolve(true);
                }
            )
            .then(
                () => {
                    dispatch(submittingResponse(false));
                    dispatch(uploadResponses());
                }
            )
            .catch( (err) => {
                dispatch(submittingResponse(false));
                dispatch(logError("submitAnswer", err));
            });
    };
};


export function createReponse() {
    return {
        type: CREATE_RESPONSE
    }
}

export function updateQuestionWithResponse() {
    return {
        type: UPDATE_QUESTION_WITH_RESPONSE
    }
}


export function submitTextAnswer() {
    return (dispatch, getState) => {
        if(getState().survalytic.status.submittingResponse) {
            return
        }

        dispatch(submitAnswer())
    };
}


export function changeTextAnswer(text) {
    return { 
        type: CHANGE_TEXT_ANSWER,
        value: text
    }
}


export function submitSliderAnswer() {
    return (dispatch, getState) => {
        if (getState().survalytic.status.submittingResponse) {
            return
        }

        dispatch(submitAnswer());
    }
}


export function updateSliderValue(value) {
    return {
        type: UPDATE_SLIDER_VALUE,
        value: value
    }
}


export function submitButtonsAnswer(item) {
    return (dispatch, getState) => {
        if (getState().survalytic.status.submittingResponse) {
            return
        }

        dispatch(setButtonsAnswer(item))

        dispatch(submitAnswer());
    };
};


export function setButtonsAnswer(item) {
    return { 
        type: SET_BUTTONS_ANSWER,
        value: item
    }
}


export function submitCheckBoxesAnswer() {
    return (dispatch, getState) => {
        if (getState().survalytic.status.submittingResponse) {
            return
        }
        
        dispatch(submitAnswer());
    };
}


export function changeCheckBoxValue(item, value) {
    return {
        type: CHANGE_CHECKBOX_VALUE,
        item: item,
        value: value 
    }
}
