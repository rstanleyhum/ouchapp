'use strict';

import { combineReducers } from 'redux';

import QuestionReducer from './questionreducer';
import StatusReducer from './statusreducer';


const SurvalyticReducer = combineReducers({
    currentq: QuestionReducer,
    status: StatusReducer
});


export default SurvalyticReducer