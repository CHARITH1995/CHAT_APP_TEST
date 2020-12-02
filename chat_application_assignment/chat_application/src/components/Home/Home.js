import React, { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";

import { Container, Row, Col, Media, Button, Card, CardBody, CardImg, CardTitle, CardSubtitle, CardText } from 'reactstrap';
import { Link, withRouter, useHistory } from 'react-router-dom';
import './home.css';
import jwt_decode from "jwt-decode";
import io from 'socket.io-client';

import Messages from '../Messages/Messages';
import Input from '../Input/Input';
import { toast } from 'react-toastify';

import fireDB from '../../configs/Firebase';

let socket;

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

    let history = useHistory()

    useEffect(()=>{
        fetch("http://localhost:5000/getData/getAllUsers", {
            method: "GET",
            headers: {
                "authorization":localStorage.getItem('token'),
                "Content-Type": "application/json",
            },
        })
            .then(res => res.json())
            .then(json => {
                setUsers(json)
            }).catch(err=>{
                console.log(err)
            })
    },[])

    useEffect(() => {
        socket = io(ENDPOINT);
        if (firstName != '' && lastName != '' && email != '') {
            socket.emit('join', { firstName, lastName, email, defaultRoom }, (error) => {
                if (error) {
                    console.log(error);
                }
            });
        }
    }, [ENDPOINT]);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setOnlineUsers(users);
        });

        socket.on('message', msg => {
            if(msg.user == chattingUserName) {
                toast.warn(`You received a message from ${msg.user}`)
            }
            setMessages(messages => [...messages, msg]);
        });
    }, [firstName, lastName, email]);


    useEffect(() => {
        fireDB.child('messages').on('value', snapshot => {
            if (chatHistory.length == 0 && snapshot.val() != null) {
                setChatHistory(snapshot.val())
            }
        })
    }, [])

    const startChat = (user) => {
        //window.location.reload(true);
        setMessages([])
        setChattinguserName(user.firstName)
        setChattinguserID(user.id); 
        Object.keys(chatHistory).map(id => {
            if ((chatHistory[id].receiver == chattingUserName && chatHistory[id].user == firstName) || 
            (chatHistory[id].receiver == firstName && chatHistory[id].user == chattingUserName)) {
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

    const logOut = () => {
        localStorage.clear();
        history.push('/');
        window.location.reload(true);
    }


    const getTheUSerListWithStats = () => {
        let usersWithStatus = [];
        //console.log(JSON.stringify(users))
         users.map((allUsers, index) => {
            let isOnline = onlineUsers.find((online) => online.email == allUsers.email);
            if (isOnline) {
                usersWithStatus.push(isOnline)
            } else {
                usersWithStatus.push(allUsers)
            }
           
        })
        //console.log(usersWithStatus)
        return (
            usersWithStatus.map((user, index) =>
                user.email != email ? (
                    user.id != undefined ? (
                        <div class="chat_list" >
                            <div class="chat_people">
                            {console.log("on",user)}
                                <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                <div class="chat_ib" onClick={e => { e.preventDefault(); startChat(user) }}>
                                    <h5>{user.firstName}{" "}{user.lastName}
                                    <span className="dot"></span></h5>
                                </div>
                            </div>
                        </div>
                    ) : (
                            <div class="chat_list" onClick={e => { e.preventDefault(); startChat(user) }} >
                                {console.log("off",user)}
                                <div class="chat_people">
                                    <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                    <div class="chat_ib">
                                        <h5>{user.firstName}{" "}{user.lastName}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        )

                ) : null
            )

        )

    }
    return (
        <div class="container">
            <h3 class=" text-center">{chattingUserName}</h3>
            <button type="button" onClick = {(e)=>{e.preventDefault();logOut()}}> <i class="fa fa-search" aria-hidden="true">Logout</i></button>
            <div class="messaging">
                <div class="inbox_msg">
                    <div class="inbox_people">
                        <div class="headind_srch">
                            <div class="recent_heading">
                                <h4>Hi {firstName} !!</h4>
                            </div>
                        </div>
                        <div class="inbox_chat">
                            {getTheUSerListWithStats()}
                        </div>
                    </div>
                    <div class="mesgs">
                        <div class="msg_history">
                            <Messages messages={messages} name={firstName} currentUser={chattingUserName} />
                        </div>
                        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;










