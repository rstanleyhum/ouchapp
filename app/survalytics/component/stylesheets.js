'use strict';

import { StyleSheet } from 'react-native';

const BACKGROUND_COLOR = 'grey';
const MAIN_BUTTON_COLOR = 'blue';
const SURVEY_BUTTON_COLOR = 'cyan';
const SURVEY_TEXT_COLOR = 'black';


const styles = StyleSheet.create({
    maincontainer: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        marginTop: 20,
    },
    container: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        marginTop: 10,
    },
    button: {
        padding:5,
        backgroundColor: MAIN_BUTTON_COLOR,
        marginTop:10,
    },
    inner: {
        flex: 1,
        marginTop:15,
        marginBottom:10,
        marginRight:20,
        marginLeft:20,
    },
    answerbutton: {
        padding: 5,
        marginTop: 5,
        backgroundColor: SURVEY_BUTTON_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textinputstyle: {
        margin: 5,
        height: 40,
        borderColor: BACKGROUND_COLOR,
        borderWidth: 1
    },
    labelstyle: {
        color: SURVEY_TEXT_COLOR,
    },
    sliderrangelabelstyleleft: {
        color: SURVEY_TEXT_COLOR,
    },
    sliderrangelabelstyleright: {
        color: SURVEY_TEXT_COLOR,
    },
    sliderlabelstyle: {
        color: SURVEY_TEXT_COLOR,
        textAlign: 'center'
    },
    sliderstyle: {
        backgroundColor: BACKGROUND_COLOR,
    },
    sliderlabelcontainer: {
        justifyContent: 'space-between',
        flex: 1,
        flexDirection: 'row',
    },
    p: {
        color: SURVEY_TEXT_COLOR,
    },
    questioncontainer: {
        flex: 1,
        backgroundColor: BACKGROUND_COLOR,
        marginLeft: 20,
        marginRight: 20,
        marginTop:10,
        marginBottom:10
    },
    skipbutton: {
        padding: 5,
        marginTop: 5,
        backgroundColor: SURVEY_BUTTON_COLOR,
        alignItems: 'center',
        justifyContent: 'center'
    },
});

export default styles;