'use strict';

import { connect } from 'react-redux';

import { pushPage, pushWebPage } from '../actions/page';
import MainWebView from '../components/mainwebview';


const mapStateToProps = (state) => {
    return {
        source: state.ouchapp.sourceUrl
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
        }
    }
}

const MainView = connect(
    mapStateToProps,
    mapDispatchToProps
)(MainWebView)

export default MainView