'use strict';
import React from 'react';
import { AppState } from 'react-native';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import Main from './app/components/main';
import PageReducers from './app/reducers/pagereducer';


let store = createStore(PageReducers);


export default class App extends React.Component {
  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    console.log("LOG: App DidMount");
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    console.log("LOG: " + nextAppState);
    this.setState({appState: nextAppState});
  }

  render() {
    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

