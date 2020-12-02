import React from 'react';

import './Input.css';

const Input = ({ setMessage, sendMessage, message }) => {

  
  return (
    <div class="type_msg">
        <div class="input_msg_write">
            <input 
            type="text" 
            class="write_msg" 
            placeholder="Type a message..." 
            value={message} 
            onChange={({ target: { value } }) => setMessage(value)}  
            onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null} />
            <button class="msg_send_btn" type="button" onClick={e => sendMessage(e)}><i class="fa fa-paper-plane-o" aria-hidden="true"></i></button>
        </div>
    </div>


  //   <form class="form">
  //   <input
  //     className="input"
  //     type="text"
  //     placeholder="Type a message..."
  //     value={message}
  //     onChange={({ target: { value } }) => setMessage(value)}
  //     onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
  //   />
  //   <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  // </form>
  )
}
  


export default Input;