import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name, currentUser }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  // if((currentUser == user)){
  return (
    isSentByCurrentUser
      ? (
        // <div className="messageContainer justifyEnd">
        //   <p className="sentText pr-10">{trimmedName}</p>
        //   <div className="messageBox backgroundBlue">
        //     <p className="messageText colorWhite">{ReactEmoji.emojify(text)}</p>
        //   </div>
        // </div>
        <div class="outgoing_msg">
          <div class="sent_msg">
            <p>{ReactEmoji.emojify(text)}</p>
            <span class="time_date">{trimmedName}</span> </div>
        </div>

      )
      : (
        currentUser == user ? (
          <div class="incoming_msg">
            <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
            <div class="received_msg">
              <div class="received_withd_msg">
                <p>{ReactEmoji.emojify(text)}</p>
                <span class="time_date">{user}</span></div>
            </div>
          </div>
          // <div className="messageContainer justifyStart">
          //   <div className="messageBox backgroundLight">
          //     <p className="messageText colorDark">{ReactEmoji.emojify(text)}</p>
          //   </div>
          //   <p className="sentText pl-10 ">{user}</p>
          // </div>
        ) : null
      )
  );
  // }else{
  //   return <div></div>
  // }
}

export default Message;