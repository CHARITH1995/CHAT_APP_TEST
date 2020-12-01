import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Join from './components/Join/Join';
import Chat from './components/Chat/Chat';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Home from './components/Home/Home';

const App = () => {

    return (
        <Router>
            <ToastContainer />
            <Route path="/" exact component={Login} />
            <Route path="/Chat" exact component={Chat} />
            <Route path="/Register" exact component={Register} />
            <Route path="/Home" exact component={Home} />
        </Router>
    )
}

export default App;