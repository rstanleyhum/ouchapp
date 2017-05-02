'use strict';

import React from 'react';
import { StyleSheet, View } from 'react-native';

import TopBar from '../containers/topbar';
import MainView from '../containers/mainview';


const HEADER = '#3b5998'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: HEADER,
    }
});

const Main = () => (
    <View style={styles.container}>
        <View style={ {height: 25} } />
        <TopBar />
        <MainView />
    </View>
);





export default Main