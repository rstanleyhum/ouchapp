'use strict';

import React from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, WebView, Platform
} from 'react-native';
import Pages from './config/assets';

import { connect } from 'react-redux';




const mapStateToProps = (state) => {
    return {
        history: state.history,
        pageId: state.pageId,
        sourceUrl: state.sourceUrl,
        status: state.title,
        canGoBack: state.history.length > 1,
        backButtonEnabled: state.history.length > 1
    }
}

export default class Main extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         history: new Array(),
    //         pageId: "disclaimer",
    //         sourceUrl: Pages["disclaimer"],
    //         canGoBack: false,
    //         status: 'Disclaimer',
    //         backButtonEnabled: false
    //     };
    // }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.topBar} />
                <View style={styles.addressBarRow}>
                    <TouchableOpacity
                        onPress={this.onBack}
                        disabled={!this.props.backButtonEnabled}
                        style={this.props.backButtonEnabled ? styles.navButton : styles.disabledButton }>
                            <Text>{'<'}</Text>
                    </TouchableOpacity>
                    <Text>{this.props.status}</Text>
                </View>
                <WebView
                    ref={WEBVIEW_REF}
                    style={{flex: 1}}
                    source={this.props.sourceUrl}
                    onMessage={this.onMessage}
                    onNavigationStateChange={this.onNavigationStateChange}
                />
            </View>
        );
    };

    onMessage = (e) => {
        var url = e.nativeEvent.data + '';
        
        console.log("onMessage: " + url);

        if (url.startsWith("hybrid://")) {
            
            // var baseUrl = url.slice(9, url.length);
            // this.setState({ pageId: baseUrl });
            // this.setState({ backButtonEnabled: true });
            // this.setState({ history: this.state.history.concat(baseUrl) });
            // this.setState({ sourceUrl: Pages[baseUrl] });
        } else if (url.startsWith("http")) {
            this.setState({ sourceUrl: {uri: url}})
        }

        console.log(this.state);
    };
        
    onBack = () => {

        if (this.state.history.length == 0) {
            this.setState({ backButtonEnabled: false });
            console.log("Can not go back")
            return;
        }
        var newHistory = this.state.history.slice();
        newHistory.pop();
        console.log(this.state.history);
        console.log(newHistory);
        this.setState({ history: newHistory.slice() });
        this.setState({ backButtonEnabled: this.state.history.length != 0 });
        console.log(this.state);
        this.refs[WEBVIEW_REF].goBack();        
    };

};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: HEADER,
//   },
//   topBar: {
//     height: 25,
//   },
//   addressBarRow: {
//       flexDirection: 'row',
//       padding: 8,
//       height: 50,
//   },
//   webView: {
//       backgroundColor: BGWASH,
//       height: 350,
//   },
//   navButton: {
//     width: 20,
//     padding: 3,
//     marginRight: 3,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: BGWASH,
//     borderColor: 'transparent',
//     borderRadius: 3,
//   },
//   disabledButton: {
//     width: 20,
//     padding: 3,
//     marginRight: 3,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: DISABLED_WASH,
//     borderColor: 'transparent',
//     borderRadius: 3,
//   },
//   statusBar: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       paddingLeft: 5,
//       height: 50,
//   },
//   statusBarText: {
//       color: 'white',
//       fontSize: 13,
//   },
//   topbar: {
//     height: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   topbarTextDisabled: {
//     color: 'gray'
//   },
//   topbarText: {
//     color: 'red'
//   }
// });


