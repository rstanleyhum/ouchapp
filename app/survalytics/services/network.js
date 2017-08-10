'use strict';

import { NetInfo } from 'react-native';


const GEONAMESORGUSERNAME = "vikasnshah";


export const GetGeolocation = (lat, long, accuracy) => {
    var p = new Promise( (resolve, reject) => {
        const baseurl = "http://api.geonames.org/countrySubdivisionJSON?lat=";
        var url = baseurl.concat(lat, "&lng=", long, "&username=", GEONAMESORGUSERNAME);
        fetch(url)
            .then( (response) => {
                return response.json();
            })
            .then( (json) => {
                var result = {
                    "region_gc_str" : json.adminCode1 || null,
                    "regionname_gc_str" : json.adminName1 || null,
                    "country_gc_str" : json.countryCode || null,
                    "latitude_gc_float" : lat || null,
                    "longitude_gc_float" : long || null,
                    "latlonaccuracy_gc_float": accuracy || null,
                };
                resolve(result);
            })
            .catch( (err) => {
                // TODO: Need to fix: ignores errors
                resolve(null);
            });
    });
    return p;
};


export const GetIpApiInfo = () => {
    var p = new Promise( (resolve, reject) => {
        const url = "http://www.ip-api.com/json";
        fetch(url)
            .then( (response) => {
                return response.json();
            })
            .then( (json) => {
                var result = {
                    "region_ipapi_str" : json.region || null,
                    "regionname_ipapi_str" : json.regionName || null,
                    "country_ipapi_str" : json.countryCode || null
                };
                resolve(result);
            })
            .catch( (err) => {
                // TODO: Need to fix: ignores errors
                resolve(null);
            });
    });
    return p;
};

export const SetupNetInfo = () => {
    NetInfo.isConnected.addEventListener('change', handleConnectionChange);
}

export const IsOnline = () => {
    return NetInfo.isConnected.fetch();
};


const handleConnectionChange = (isConnected) => {
}




