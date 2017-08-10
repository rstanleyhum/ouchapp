'use strict';

import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import { View } from 'react-native';

import ButtonsAnswer from './buttonsanswer';
import CheckBoxesAnswer from './checkboxesanswer';
import SliderAnswer from './slideranswer';
import TextAnswer from './textanswer';

import { TYPE_BUTTONS, TYPE_TEXT, TYPE_CHECKBOXES, TYPE_SLIDER } from '../../survalytics/services/question';



const Answer = ({entrytype, buttonstype, texttype, slidertype, checkboxestype}) => {
        if (entrytype == buttonstype) {
            return <ButtonsAnswer />
        } else if (entrytype == texttype) {
            return <TextAnswer />
        } else if (entrytype == slidertype) {
            return <SliderAnswer />
        } else if (entrytype == checkboxestype) {
            return <CheckBoxesAnswer />
        } else {
            return <View />
        }
};


Answer.propTypes = {
    entrytype: PropTypes.string.isRequired,
    buttonstype: PropTypes.string.isRequired,
    texttype: PropTypes.string.isRequired,
    slidertype: PropTypes.string.isRequired,
    checkboxestype: PropTypes.string.isRequired
};


const mapStateToProps = state => ({
    entrytype: state.survalytic.currentq.question.json_str.questiontype_str,
    buttonstype: TYPE_BUTTONS,
    texttype: TYPE_TEXT,
    slidertype: TYPE_SLIDER,
    checkboxestype: TYPE_CHECKBOXES   
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Answer);
