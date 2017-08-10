'use strict';

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import HTMLView from 'react-native-htmlview';

import Answer from './answer';
import { setSkippedSurvey } from '../actions/questions';

import styles from './stylesheets';


const Question = ({onSkipPressed, htmlcontent}) => (
    <View style={styles.questioncontainer}>
        <TouchableOpacity
            onPress={onSkipPressed}
            style={styles.skipbutton}
        >
            <Text>Skip Survey</Text>
        </TouchableOpacity>
        <View style={styles.inner}>
            <HTMLView
                value={['<p>', htmlcontent, '</p>'].join('')}
                stylesheet={styles}   
            />
        </View>
        <Answer />
    </View>
);


Question.propTypes = {
    onSkipPressed: PropTypes.func.isRequired,
    htmlcontent: PropTypes.string.isRequired
}


const mapStateToProps = state => ({
    htmlcontent: state.survalytic.currentq.question.json_str.questionprompt_str
});


const mapDispatchToProps = dispatch => ({
    onSkipPressed: () => dispatch(setSkippedSurvey(true))
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);
