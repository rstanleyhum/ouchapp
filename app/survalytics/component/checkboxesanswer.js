'use strict';

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-checkbox';

import { submitCheckBoxesAnswer, changeCheckBoxValue } from '../actions/answer';

import styles from './stylesheets';


const CheckBoxesAnswer = ({checkboxesinfo, onChange, onSubmitPress}) => {
    return (
        <View>
            <View style={styles.inner}>
                { checkboxesinfo.map( (item) => 
                    <CheckBox
                        key={item.name}
                        labelStyle={styles.labelstyle} 
                        label={item.name} 
                        checked={item.result}
                        onChange={ (current_value) => { onChange(item, !current_value); } }
                    />
                )}
            </View>
            <TouchableOpacity 
                style={styles.answerbutton}
                onPress={onSubmitPress}
            >
                <Text>Submit</Text>
            </TouchableOpacity>
        </View>
    )
};


CheckBoxesAnswer.propTypes = {
    checkboxesinfo: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    onSubmitPress: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    checkboxesinfo: state.survalytic.currentq.question.inferred.checkbox_values.map( (v, k) => {
        return { 
            name: v.checkbox_answer_response_text,
            result: v.checkbox_answer_checked
        } 
    })
});

const mapDispatchToProps = dispatch => ({
    onSubmitPress: () => dispatch(submitCheckBoxesAnswer()),
    onChange: (item, checked) => dispatch(changeCheckBoxValue(item, checked))
});


export default connect(mapStateToProps, mapDispatchToProps)(CheckBoxesAnswer);
