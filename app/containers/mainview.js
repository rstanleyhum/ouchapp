'use strict';

import { connect } from 'react-redux';

import { pushPage, pushWebPage } from '../actions/page';
import MainWebView from '../components/mainwebview';

import { logInfo } from '../survalytics/actions/logging';


const mapStateToProps = (state) => {
    return {
        source: state.ouchapp.sourceUrl,
        url: state.ouchapp.history[state.ouchapp.history.length-1]
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onMessage: (event) => {
            var url = event.nativeEvent.data + '';

            if (url.startsWith("hybrid://")) {
                var baseUrl = url.slice(9, url.length);
                dispatch(pushPage(baseUrl));
            }

            if (url.startsWith("http")) {
                dispatch(pushWebPage(url));
            }
        },
        logUrl: (url) => {
            dispatch(logInfo("ViewPage", url));
        }
    }
}

const MainView = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainWebView)

export default MainView