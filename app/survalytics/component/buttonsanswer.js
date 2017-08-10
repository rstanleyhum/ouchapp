'use strict';

import { connect } from 'react-redux';

import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import { submitButtonsAnswer } from '../actions/answer';

import styles from './stylesheets';


const ButtonsAnswer = ({buttonsinfo, onPress}) => {
    return (
        <View>
            <View style={styles.inner}>
                {buttonsinfo.map( (item) => 
                    <TouchableOpacity
                        key={item.name}
                        style={styles.answerbutton}
                        onPress={ () => onPress(item) }
                    >
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
};


ButtonsAnswer.propTypes = {
    buttonsinfo: PropTypes.array.isRequired,
    onPress: PropTypes.func.isRequired
};


const mapStateToProps = state => ({ 
    buttonsinfo: state.survalytic.currentq.question.inferred.button_values.map( (v, k) => {
        return {
            name: v.button_response_text
        }
    }),
});

const mapDispatchToProps = dispatch => ({
    onPress: (item) => {
        dispatch(submitButtonsAnswer(item));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ButtonsAnswer)
