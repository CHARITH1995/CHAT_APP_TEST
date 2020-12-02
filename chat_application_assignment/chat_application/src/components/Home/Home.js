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
    }, []);

    useEffect(() => {
        socket.on("roomData", ({ users }) => {
            setOnlineUsers(users);
        });

        socket.on('message', msg => {
            console.log("mess", msg)
            setMessages(messages => [...messages, msg]);
        });
    }, [firstName, lastName, email]);


    useEffect(()=>{
        fireDB.child('messages').on('value', snapshot => {
            if(chatHistory.length == 0 ){
                console.log("again inside")
                console.log(chatHistory)
                console.log(Object.keys(snapshot.val()))

                setChatHistory(snapshot.val())
            }
        })
    },[])




    const startChat = (user) => {
        var name = user.firstName
        setChattinguserName(name)
        setChattinguserID(user.id);
        setMessages([])
        Object.keys(chatHistory).map(id =>{
            console.log(chatHistory[id])
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
            var typedMessage = {
                text: message,
                user: firstName,
                receiver: chattingUserName
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

    return (
        <MDBContainer fluid className="HPpageBackground">
            <MDBRow>
                {/* <InfoBar userName={firstName} show = {false} /> */}
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
                                    {
                                        onlineUsers && onlineUsers.map((user, index) =>
                                            user.email !== email ? (
                                                <li key={index} className="item-class">
                                                    <span className="NBlink" onClick={e => { e.preventDefault(); startChat(user) }} >{user.firstName}{" "}{user.lastName}</span>
                                                    {
                                                        onlineUsers.find((onlineUser) => onlineUser.email == user.email) ? (
                                                            <span className="dot"></span>
                                                        ) : null
                                                    }
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
                                    <InfoBar userName={chattingUserName} show={false} />
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