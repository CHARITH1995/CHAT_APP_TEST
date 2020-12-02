import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import { Container, Row, Col, Media, Button, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { Link, withRouter, useHistory } from 'react-router-dom';
import './home.css';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import { toast } from 'react-toastify';
import ChatList from '../List/List';

import fireDB from '../../configs/Firebase';

let socket;
var onlineUsers = []

const Home = () => {

    const [users, setUsers] = useState([]);
    const [firstName, setFirstName] = useState(jwt_decode(localStorage.getItem('token')).firstName);
    const [lastName, setLastName] = useState(jwt_decode(localStorage.getItem('token')).lastName);
    const [email, setEmail] = useState(jwt_decode(localStorage.getItem('token')).email);
    const [defaultRoom, setDefaultRoom] = useState('Home')
    const [onlineUsers, setOnlineUsers] = useState([])

    const [chatHistory, setChatHistory] = useState([])

    const [chattingUserName, setChattinguserName] = useState('')
    const [chattingUserID, setChattinguserID] = useState('')

    const ENDPOINT = 'localhost:5000';

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const history = useHistory()

    useEffect(() => {
        console.log("here fetch")
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
    }, [])

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
    }, []);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setOnlineUsers(users);
        });

        socket.on('message', msg => {
            if((msg.user == chattingUserName)){
                toast.warn(`You received a message from ${msg.user}`)
            }
            setMessages(messages => [...messages, msg]);
        });
    }, [firstName, lastName, email]);


    useEffect(() => {
        fireDB.child('messages').on('value', snapshot => {
            if (chatHistory.length == 0 && snapshot.val() != null) {
                console.log(chatHistory)
                setChatHistory(snapshot.val())
            }
        })
    }, [])

    const startChat = (user) => {
        setChattinguserName(user.firstName)
        setChattinguserID(user.id);
        setMessages([])
        Object.keys(chatHistory).map(id => {
            if ((chatHistory[id].receiver == chattingUserName && chatHistory[id].user == firstName) || (chatHistory[id].receiver == firstName && chatHistory[id].user == chattingUserName)) {
                var chatMessages = {
                    text: chatHistory[id].text,
                    user: chatHistory[id].user,
                    receiver: chatHistory[id].receiver
                }
                setMessages(messages => [...messages, chatMessages]);
            }
        })
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (message) {
            var ifUserOnline = onlineUsers.find((user) => user.firstName == chattingUserName)
            if (typeof (ifUserOnline) == "undefined") {
                var typedMessage = {
                    text: message,
                    user: firstName,
                    receiver: chattingUserName,
                    status: "unread"
                }

            } else {
                var typedMessage = {
                    text: message,
                    user: firstName,
                    receiver: chattingUserName,
                    status: "read"
                }
            }

            fireDB.child('messages').push(
                typedMessage,
                error => {
                    if (error)
                        console.log(error)
                }
            )
            var msg = {
                text: message,
                id: chattingUserID
            }
            socket.emit('sendMessage', msg, () => setMessage(''));
            setMessages(messages => [...messages, typedMessage]);
        }

    }

    const handleSubmit = () => {
        localStorage.clear();
        history.push('/');
    }


    const getTheUSerListWithStats = () => {
        let usersWithStatus = [];
        users.map((allUsers, index) => {
            let isOnline = onlineUsers.find((online) => online.email == allUsers.email);
            if (isOnline) {
                usersWithStatus.push(isOnline)
            } else {
                usersWithStatus.push(allUsers)
            }
        })
        return (
            usersWithStatus.map((user, index) =>
                user.email != email ? (
                    user.id != undefined ? (
                        <li key={index} className="item-class">
                            <span className="NBlink" onClick={e => { e.preventDefault(); startChat(user) }} >{user.firstName}{" "}{user.lastName}</span>
                            <span className="dot"></span>
                        </li>
                    ) : (
                            <li key={index} className="item-class">
                                <span className="NBlink" onClick={e => { e.preventDefault(); startChat(user) }} >{user.firstName}{" "}{user.lastName}</span>
                            </li>
                        )

                ) : null
            )

        )

    }
    return (
        <MDBContainer fluid className="HPpageBackground">
            <MDBRow>
                <MDBCol xl="4" lg="4" md="4" style={{ padding: "0px" }} >
                    <div className="NBbackground">
                        <div id="sidebar-wrapper">
                            <nav id="spy">
                                <ul className="sidebar-nav nav">
                                    <div className="listSide">
                                        <li className="sidebar-brand">
                                            <button type="submit" class="LPbtn1Out" onClick={handleSubmit}>Logout</button>
                                            <a href="#"><span className="NBbrand">Hello {firstName} !!</span></a>
                                        </li>
                                    </div>
                                    <div>
                                    </div>
                                    {getTheUSerListWithStats()}
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
                                    <InfoBar userName={chattingUserName} show={false} />
                                    <Messages messages={messages} name={firstName} currentUser = {chattingUserName}/>
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





