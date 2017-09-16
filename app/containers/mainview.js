'use strict';

import { connect } from 'react-redux';

import { pushPageAndLog, pushWebPageAndLog } from '../actions/page';
import MainWebView from '../components/mainwebview';


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
                dispatch(pushPageAndLog(baseUrl));
            }

            if (url.startsWith("http")) {
                dispatch(pushWebPageAndLog(url));
            }
        },
    }
}

const MainView = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainWebView)

export default MainView