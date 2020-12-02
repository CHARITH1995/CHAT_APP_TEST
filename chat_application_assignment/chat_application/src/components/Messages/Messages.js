import React from 'react';

import ScrollToBottom from 'react-scroll-to-bottom';

import Message from './Message/Message';

import './Messages.css';

const Messages = ({ messages, name , chattingUser }) => (
  <ScrollToBottom className="messages">
    {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>
      // (message.receiver == chattingUser && message.user == name)||(message.receiver == name && message.user == chattingUser)? (
        
      // ):(
      //   <div></div>
      // )
    )}
  </ScrollToBottom>
);

export default Messages;