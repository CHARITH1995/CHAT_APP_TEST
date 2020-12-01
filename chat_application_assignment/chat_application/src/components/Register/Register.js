import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Register.css'


const Register = () => {
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        if (confirmPassword == password) {
            const user = {
                firstName: firstName,
                lastName: lastName,
                password: password,
                email:email
            }
            fetch("http://localhost:5000/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user)
            })
                .then(res => res.json())
                .then(json => {
                    if (json.success) {
                        toast.success("You are Registered successfully :) ");
                        // localStorage.clear();
                        //  localStorage.setItem('token',json.token);
                        //  localStorage.setItem('teacherId',json.userData.teacherId);
                        //this.props.history.push('/Home');
                    } else {
                        toast("Error logging in :( ");
                    }
                })

        } else {
            toast.error("passwords not matched :(")
            setConfirmPassword('');
            setPassword('');
        }
    }

    return (
        <div className="login-form">
            <form>
                <div className="loginLogoCover">
                    <img src={"http://i68.tinypic.com/20qfktv.png"} width="200" height="200" alt="" />
                    <h6 className="signUp-link" >Already a user ?<Link to={"/"}> Login Here</Link></h6>
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="First Name" required="required" className="LoginInputField" name="firstName" onChange={(event) => setFirstName(event.target.value)} />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="Last Name" required="required" className="LoginInputField" name="lastName" onChange={(event) => setLastName(event.target.value)} />
                </div>
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="E mail" required="required" className="LoginInputField" name="email" onChange={(event) => setEmail(event.target.value)} />
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Password" required="required" className="LoginInputField" name="password" name="password" onChange={(event) => setConfirmPassword(event.target.value)} />
                </div>
                <div class="form-group">
                    <input type="password" class="form-control" placeholder="Confirm Password" required="required" className="LoginInputField" name="comfirmPassword" name="comPassword" onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div class="form-group">
                    <div className="LPbtnCover">
                        <button type="submit" class="LPbtn1 " onClick={handleSubmit}>Register</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;