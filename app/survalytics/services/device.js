'use strict';

import { Constants } from 'expo';
import { Platform } from 'react-native';

const DAY_OF_WEEK = ["SUN", 'MON", "TUE", "WED", "THU", "FRI", "SAT'];


export const GetDeviceInfo = () => {
    var p = new Promise( (resolve, reject) => {
        var result = {
            "device_platform" : Platform.OS,
            "device_osversion" : Platform.Version,
            "device_id" : Constants.deviceId,
            "device_model" : (Constants.platform != null) ? Constants.platform.ios.model : Constants.deviceName,
            "device_version_number" : Constants.deviceYearClass
        }
        resolve(result);
    });
    return p;
};


export const GetLocalInfo = () => {
    var p = new Promise( (resolve, reject) => {
        var local_now = Date.now();
        var today = new Date();
        var offset = today.getTimezoneOffset();
        var day = today.getDay();
        var result = {
            "localtime_ms_int" : local_now,
            "localtime_hrsmilitary_int" : today.getHours(),
            "localtime_dayofweek_str" : DAY_OF_WEEK[today.getDay()],
            "localtimezone_str" : offset.toString(),
            "country_tm_str" : null,
            "lo_lang_str" : null
        };
        resolve(result);
    });
    return p;
};

