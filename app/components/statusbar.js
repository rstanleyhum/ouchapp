'use strict';

import React, { PropTypes } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';

const BGWASH = 'rgba(255,255,255,0.8)';
const DISABLED_WASH = 'rgba(255,255,255,0.25)';


const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        padding: 8,
        height: 50,
    },
    activeButton: {
        width: 50,
        padding: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: BGWASH,
        borderColor: 'transparent',
        borderRadius: 3,
    },
    disabledButton: {
        width: 50,
        padding: 3,
        marginRight: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: DISABLED_WASH,
        borderColor: 'transparent',
        borderRadius: 3,
    },
    buttonText:{
        color: 'white',
        fontSize: 26,
    },
    statusBarText: {
        marginLeft: 10,
        color: 'white',
        fontSize: 26
    }
});

export default class StatusBar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { onButtonClick, enableButton, text } = this.props;

        return (
            <View style={styles.topBar}>
                <TouchableOpacity
                    onPress={onButtonClick}
                    disabled={!enableButton}
                    style={enableButton ? styles.activeButton : styles.disabledButton }>
                        <Text style={styles.buttonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.statusBarText}>{text}</Text>
            </View>
        );
    }
}

