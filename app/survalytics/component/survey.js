'use strict';

import { connect } from 'react-redux';

import React, { PropTypes } from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import Question from './question';


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


const Survey = ({question, skipped}) => {
    if ((!skipped) && (typeof question != 'undefined') && (question != null)) {
        return (
            <ScrollView style={styles.container} >
                <Question />
            </ScrollView>
        );
    } else {
        return null; 
    }
};


Survey.propTypes = {
    question: PropTypes.any,
    skipped: PropTypes.bool.isRequired
}


const mapStateToProps = state => ({
    question: state.survalytic.currentq.question,
    skipped: state.survalytic.status.skippedSurvey,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Survey);
