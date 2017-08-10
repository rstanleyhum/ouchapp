'use strict';

import { CloneQuestion } from '../services/question';
import { UpdateQuestionWithResponse } from '../services/question';
import { CHANGE_TEXT_ANSWER, UPDATE_SLIDER_VALUE, SET_BUTTONS_ANSWER, CHANGE_CHECKBOX_VALUE, UPDATE_QUESTION_WITH_RESPONSE } from '../actions/answer';
import { SET_CURRENT_QUESTION } from '../actions/questions';


const initialState = {
    question: null,
}

function QuestionReducer(state = initialState, action) {
    
    switch(action.type) {
        case CHANGE_TEXT_ANSWER:

            var newquestion = CloneQuestion(state.question);
            newquestion.inferred.text_values.text_answer_text = action.value;
            return Object.assign({}, state, {
                question: newquestion 
            });
        
        case UPDATE_SLIDER_VALUE:
            var newquestion = CloneQuestion(state.question);
            newquestion.inferred.slider_values.slider_value = action.value;
            return Object.assign({}, state, {
                question: newquestion
            });

        case SET_BUTTONS_ANSWER:
            var newquestion = CloneQuestion(state.question);
            for (var i = 0; i < newquestion.inferred.button_values.length; i++) {
                if (newquestion.inferred.button_values[i].button_response_text == action.value.name) {
                    newquestion.inferred.button_values[i].button_selected = true;
                    break;
                }
            }
            return Object.assign({}, state, {
                question: newquestion
            });

        case CHANGE_CHECKBOX_VALUE:
            var newquestion = CloneQuestion(state.question);
            for (var i = 0; i < newquestion.inferred.checkbox_values.length; i++) {
                if (newquestion.inferred.checkbox_values[i].checkbox_answer_response_text == action.item.name) {
                    newquestion.inferred.checkbox_values[i].checkbox_answer_checked = action.value;
                    break;
                }
            }
            return Object.assign({}, state, {
                question: newquestion
            });
        
        case SET_CURRENT_QUESTION:
            var newquestion = CloneQuestion(action.value);
            return Object.assign({}, state, {
                question: newquestion
            });

        case UPDATE_QUESTION_WITH_RESPONSE:
            return Object.assign({}, state, {
                question: UpdateQuestionWithResponse(state.question)
            });
                    
        default:
            return state;
    }
}

export default QuestionReducer