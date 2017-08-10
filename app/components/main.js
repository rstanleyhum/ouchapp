'use strict';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import TopBar from '../containers/topbar';
import MainView from '../containers/mainview';

import Survey from '../survalytics/component/survey';


const HEADER = '#3b5998'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HEADER,
        marginTop: 20,
    }
});

const Main = () => (
    <View style={styles.container}>
        <TopBar />
        <Survey />
        <MainView />
    </View>
);





export default Main