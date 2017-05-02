'use strict';

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

