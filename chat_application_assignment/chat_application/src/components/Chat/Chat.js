import React, { useEffect, useState } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

let socket;

const Chat = ({ location }) => {

    const [socketID, setSocketID] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [users, setUsers] = useState('');

    const ENDPOINT = 'localhost:5000';


    useEffect(() => {
        const { id ,email , firstName , lastName } = queryString.parse(location.search);
        setSocketID(id)
        setFirstName(firstName);
        setLastName(lastName);
        setEmail(email)

    }, [ENDPOINT, location.search]);


    useEffect(() => {

        socket = io(ENDPOINT);

        socket.on('message', (message) => {
            console.log(message)
            setMessages([...messages, message]);
        })

    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        var msg = {
            socketID,
            message,
        }
        if (message) {
            socket.emit('sendMessage', msg, () => setMessage(''));
        }
    }



    return (
        <div className="outerContainer">
            <InfoBar userName={firstName + " "+lastName} />
            <div className="container">
                <Messages messages={messages} name={firstName} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    );
}


export default Chat