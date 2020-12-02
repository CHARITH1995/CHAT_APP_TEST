import React, { useEffect, useState } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Login.css'


const Login = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory()

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = {
            userName: userName,
            password: password
        }
        fetch("http://localhost:5000/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(json => {
                //console.log(JSON.stringify(json))
                if (json.success) {
                    toast.success("You are logged in :) ");
                    localStorage.clear();
                    localStorage.setItem('token', json.token);
                    history.push('/Home');
                    window.location.reload(true);
                } else {
                    toast.error("Error logging in :( ");
                }
            }).catch(error => {
                console.log(error)
            })

    }

    return (
        <div class="login-form">
            <form>
                <div className="loginLogoCover">
                    <img src={"http://i68.tinypic.com/20qfktv.png"} width="200" height="200" alt="" />
                    <h6 className="signUp-link" >Or You can <Link to={"/Register"}> register using here</Link></h6>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Username" required="required" className="LoginInputField" name="userName" onChange={(event) => setUserName(event.target.value)} />
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Password" required="required" className="LoginInputField" name="password" name="userName" onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div class="form-group">
                    <div className="LPbtnCover">
                        <button type="submit" class="LPbtn1 " onClick={handleSubmit}>LOGIN</button>
                    </div>
                </div>
                <div className="clearfix">
                    <a href="#" className="pull-center">Forgot Password?</a>
                </div>
            </form>
        </div>
    )
}

export default withRouter(Login);