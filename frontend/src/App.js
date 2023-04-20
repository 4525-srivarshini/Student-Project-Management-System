import React, { createContext, useReducer } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./components/Home"
import { initialState, reducer } from "../src/reducer/UseReduser"
import Signup from "./components/Signup";

export const UserContext = createContext();

const App = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const setUserType = (userType) => {
        dispatch({ type: 'SET_USER_TYPE', payload: userType });
    };

    return ( <
        UserContext.Provider value = {
            { state, dispatch, setUserType }
        } >
        <
        BrowserRouter >
        <
        Routes >
        <
        Route exact path = "/"
        element = { < Home / > }
        /> <
        Route exact path = "/login"
        element = { < Signup / > }
        /> < /
        Routes >

        <
        /BrowserRouter> < /
        UserContext.Provider >
    );
};

export default App;