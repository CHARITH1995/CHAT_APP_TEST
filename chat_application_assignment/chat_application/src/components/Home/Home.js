import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { Container, Row, Col, Media, Button, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import './home.css';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';
import { withRouter, Link } from "react-router-dom";

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import ChatList from '../List/List'

let socket;
var onlineUsers = []

const Home = () => {

    const [users, setUsers] = useState([]);
    const [firstName, setFirstName] = useState(jwt_decode(localStorage.getItem('token')).firstName);
    const [lastName, setLastName] = useState(jwt_decode(localStorage.getItem('token')).lastName);
    const [email, setEmail] = useState(jwt_decode(localStorage.getItem('token')).email);
    const [defaultRoom, setDefaultRoom] = useState('Home')
    const [onlineUsers, setOnlineUsers] = useState([])

    const [chattingUserName, setChattinguserName] = useState('')
    const [chattingUserID, setChattinguserID] = useState('')

    const ENDPOINT = 'localhost:5000';

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // useEffect(() => {
    //     console.log("here fetch")
    //     fetch("http://localhost:5000/user/getAllUsers", {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //     })
    //         .then(res => res.json())
    //         .then(json => {
    //             setUsers(json)

    //         });
    // }, [])

    useEffect(() => {

        socket = io(ENDPOINT);
        fetch("http://localhost:5000/user/getAllUsers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(json => {
                setUsers(json)

            });
        if (firstName != '' && lastName != '' && email != '') {
            socket.emit('join', { firstName, lastName, email, defaultRoom }, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }

        socket.on("roomData", ({ users }) => {
            setOnlineUsers(users);
        });
    }, []);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setOnlineUsers(users);
        });

        socket.on('message', msg => {
            console.log("mess", msg)
            setMessages(messages => [...messages, msg]);
        });
    }, [firstName, lastName, email])


    const startChat = (user) => {
        var name = user.firstName + " " + user.lastName
        setChattinguserName(name)
        setChattinguserID(user.id)
        setMessages([])
    }

    const sendMessage = (e) => {
        var typedMessage = {
            text:message,
            user:firstName
        }
        setMessages(messages => [...messages, typedMessage]);

        e.preventDefault();
        if (message) {
            var msg = {
                text:message,
                id:chattingUserID
            }
            socket.emit('sendMessage', msg, () => setMessage(''));
        }
    }


    return (
        <MDBContainer fluid className="HPpageBackground">
            <MDBRow>    
                <InfoBar userName={firstName} />
                <MDBCol xl="4" lg="4" md="4" style={{ padding: "0px" }} >
                    <div className="NBbackground">
                        <div id="sidebar-wrapper">
                            <nav id="spy">
                                <ul className="sidebar-nav nav">
                                    <li className="sidebar-brand">
                                        <a href="#"><span className="NBbrand">CHAT APP</span></a>

                                    </li>
                                    {
                                        onlineUsers && onlineUsers.map((user, index) =>
                                            user.email !== email ? (
                                                <li key={index} className="item-class" onClick={(e) => startChat(user)} >
                                                    <div className="inner-items">
                                                        <span className="NBlink">{user.firstName}{" "}{user.lastName}</span>
                                                        {
                                                            onlineUsers.find((onlineUser) => onlineUser.email == user.email) ? (
                                                                <span className="dot"></span>
                                                            ) : null
                                                        }
                                                    </div>
                                                </li>
                                            ) : null

                                        )
                                    }
                                </ul>
                            </nav>
                        </div>
                    </div>
                </MDBCol>
                <MDBCol xl="8" lg="8" md="8">
                    {
                        chattingUserName != '' ? (
                            <div className="outerContainer">
                                <div className="container">
                                    <InfoBar userName={chattingUserName} />
                                    <Messages messages={messages} name={firstName} />
                                    <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                                </div>
                            </div>
                        ) : null
                    }
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    )
}

export default Home;