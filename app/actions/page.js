'use strict';

import { logInfo } from '../survalytics/actions/logging';

export const PUSH_PAGE = 'PUSH_PAGE';
export const POP_PAGE = 'POP_PAGE';
export const PUSH_WEB_PAGE = 'PUSH_WEB_PAGE';


export function pushWebPage(url) {
    return { type: PUSH_WEB_PAGE, url }
}


export function pushPage(id) {
    return { type: PUSH_PAGE, id }
}

export function popPage() {
    return { type: POP_PAGE }
}


export function pushWebPageAndLog(url) {
    return (dispatch, getState) => {
        var currentPage = getState().ouchapp.history.slice(-1)[0];
        var pageinfo = { current: currentPage, going: url };
        dispatch(logInfo("PushWebPage", pageinfo));
        dispatch(pushWebPage(url));
    }
}

export function pushPageAndLog(id) {
    return (dispatch, getState) => {
        var currentPage = getState().ouchapp.history.slice(-1)[0];
        var pageinfo = { current: currentPage, going: id };
        dispatch(logInfo("PushPage", pageinfo));
        dispatch(pushPage(id));
    }
}

export function popPageAndLog() {
    return (dispatch, getState) => {
        var currentPage = getState().ouchapp.history.slice(-1)[0];
        var toPage = null;
        if (getState().ouchapp.history.length > 1) {
            toPage = getState().ouchapp.history.slice(-2, -1)[0];
        }
        var pageinfo = { current: currentPage, going: toPage };
        dispatch(logInfo("MyPopPage", pageinfo));
        dispatch(popPage());
    }
}