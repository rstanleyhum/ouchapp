'use strict';

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { StyleSheet, View, Text, Slider, TouchableOpacity } from 'react-native';

import { updateSliderValue, submitSliderAnswer } from '../actions/answer';

import styles from './stylesheets';



const SliderAnswer = ({value, maxvalue, minvalue, onValueChange, onSubmitPress}) => (
    <View>
        <View style={styles.inner}>
            <View style={styles.sliderlabelcontainer}>
                <Text style={styles.sliderrangelabelstyleleft }>Min:{minvalue}</Text>
                <Text style={styles.sliderrangelabelstyleright}>Max:{maxvalue}</Text>
            </View>
            <Slider 
                maximumValue={maxvalue}
                minimumValue={minvalue}
                style={styles.sliderstyle}
                onValueChange={ (value) => onValueChange(value) }
            />
            <Text style={styles.sliderlabelstyle }>{value}</Text>
        </View>
        <TouchableOpacity 
            onPress={onSubmitPress}
            style={styles.answerbutton}
        >
            <Text>Submit</Text>
        </TouchableOpacity>
    </View>
);


SliderAnswer.propTypes = {
    value: PropTypes.number.isRequired,
    maxvalue: PropTypes.number.isRequired,
    minvalue: PropTypes.number.isRequired,
    onValueChange: PropTypes.func.isRequired,
    onSubmitPress: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
    value: state.survalytic.currentq.question.inferred.slider_values.slider_value,
    maxvalue: state.survalytic.currentq.question.inferred.slider_values.slider_max,
    minvalue: state.survalytic.currentq.question.inferred.slider_values.slider_min,
});

const mapDispatchToProps = dispatch => ({
    onValueChange: (value) => dispatch(updateSliderValue(value)),
    onSubmitPress: () => dispatch(submitSliderAnswer())
});


export default connect(mapStateToProps,mapDispatchToProps)(SliderAnswer)
