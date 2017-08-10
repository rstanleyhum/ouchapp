'use strict';

import React, { PropTypes } from 'react';
import { WebView } from 'react-native';


export default class MainWebView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <WebView
                style={{flex: 1}}
                source={this.props.source}
                onMessage={e => {this.props.onMessage(e);}}
                onLoadEnd={ () => {this.props.logUrl(this.props.url);}}
            />
        );
    }
}
