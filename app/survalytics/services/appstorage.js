'use strict';

import { AsyncStorage } from 'react-native';

const uuidv4 = require('uuid/v4');

export const USERGUID_KEY = '@UserGUID';


async function GetUserGUID() {
    try {
        const guid = await AsyncStorage.getItem(USERGUID_KEY);
        if (guid !== null) {
            return guid;
        }
        var newguid = uuid4();
        await AsyncStorage.setItem(USERGUID_KEY, newguid);
        return newguid;
    } catch (error) {
        return 'ERROR_IN_GUID';
    }
}

export { GetUserGUID };
