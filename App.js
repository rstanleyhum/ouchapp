'use strict';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Main from './app/components/main';
import PageReducers from './app/reducers/pagereducer';


let store = createStore(PageReducers);


export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

