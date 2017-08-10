'use strict';
import React from 'react';
import { AppState } from 'react-native';
import Expo, { AppLoading } from 'expo';

import { Provider } from 'react-redux';

import store from './app/store';
import Main from './app/components/main';


import { SetupLocalDB } from './app/survalytics/services/localdb';
import { SetupNetInfo } from './app/survalytics/services/network';
import { SetUserGUID } from './app/survalytics/services/response';
import { logInfo, logError } from './app/survalytics/actions/logging';

import { downloadSurvey, viewQuestions, deleteAllQuestions, resetSkipSurvey, uploadResponses } from './app/survalytics/actions/survey';


export default class App extends React.Component {
  state = {
    isReady: false,
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    store.dispatch(logInfo("App", "App componentDidMount"));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    store.dispatch(logInfo("App", "State Change: " + nextAppState));
    this.setState({appState: nextAppState});
  }

  componentWillMount() {
    this.setup();
  }

  setup() {
    Promise.all([SetupLocalDB(), SetupNetInfo(), SetUserGUID()])
      .then(results => {
        
        this.setState({isReady: true});
      
        return store.dispatch(uploadResponses());
      })
      .then( () => {
        return store.dispatch(downloadSurvey());
      })
      .catch(err => {
        store.dispatch(logError("App", err));
      });
  }

  render() {
    if(!this.state.isReady) {
      return <AppLoading />;
    }

    return (
      <Provider store={store}>
        <Main />
      </Provider>
    );
  }
}

