'use strict';

import { GetNextUnansweredQuestion } from '../services/localdb';
import { loadingQuestion } from './status';
import { logError } from './logging';

export const SET_CURRENT_QUESTION = 'SET_CURRENT_QUESTION';
export const SET_SKIPPED_SURVEY = 'SET_SKIPPED_SURVEY';


export function setCurrentQuestion(q) {
    return {
        type: SET_CURRENT_QUESTION,
        value: q
    }
}

export function setSkippedSurvey(value) {
    return {
        type: SET_SKIPPED_SURVEY,
        value: value
    }
}

export function setNewQuestion() {
    return (dispatch, getState) => {
        if(getState().survalytic.status.loadingQuestion) {
            return
        }

        dispatch(loadingQuestion(true));

        GetNextUnansweredQuestion()
            .then( (q) => {
                dispatch(setCurrentQuestion(q));
            })
            .then( () => {
                dispatch(loadingQuestion(false));
            })
            .catch( (err) => {
                dispatch(logError("setNewQuestion", err));
                dispatch(loadingQuestion(false));
            });
    };
}