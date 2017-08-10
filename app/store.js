'use strict';

import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';

import SurvalyticReducer from './survalytics/reducers/survalyticreducer';
import PageReducers from './reducers/pagereducer';


const middleware = () => {
    return applyMiddleware(thunk)
}

export default createStore(
    combineReducers({
        survalytic: SurvalyticReducer,
        ouchapp: PageReducers,
    }),
    middleware(),
)

