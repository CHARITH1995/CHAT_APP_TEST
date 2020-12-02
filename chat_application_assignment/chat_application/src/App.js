import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
    useLocation
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';



const App = () => {
    return (
        <Router>
            <ToastContainer />
            <Route path="/" exact component={Login} />
            <Route path="/Register" component={Register} />
            <Switch>
                {(localStorage.getItem('token')) ? <Route path="/Home" component={Home} /> : <Redirect to="/" />  }
            </Switch>

        </Router>
    )
}

export default App;

