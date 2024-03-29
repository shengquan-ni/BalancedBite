/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import { createStore } from "redux";
import { Provider } from "react-redux";
import EntireApp from "./src/components/EntireApp";


/**
 * Redux
 * 
 * https://www.youtube.com/watch?v=KcC8KZ_Ga2M
 * 
 * store - hold our state (only one state) (readonly state)
 * state - can only modified using action (through reducer)
 * reducer - receives the actions and modifieds the state and give new state
 * dispatcher - action needs to be sent by someone - 
 *  known as dispatching an action (Eg: press a button)
 */

const initialState = {
  currentToken : ""
}

// when the dispatcher is called, it will map action to reducers to update store state
const reducer = (state = initialState, action) => {
  switch(action.type) {
    case "CHANGE_TOKEN":
      return {currentToken : action.token};
  }
  
  return state;
}

const store = createStore(reducer);

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <EntireApp></EntireApp>
      </Provider>
    );
  }
}
