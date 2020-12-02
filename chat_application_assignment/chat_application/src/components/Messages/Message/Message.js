import React from 'react';

import './Message.css';

import ReactEmoji from 'react-emoji';

const Message = ({ message: { text, user }, name, currentUser }) => {
  let isSentByCurrentUser = false;

  const trimmedName = name.trim().toLowerCase();

  if (user === trimmedName) {
    isSentByCurrentUser = true;
  }

  return (
    isSentByCurrentUser
      ? (
        <div class="outgoing_msg">
          <div class="sent_msg">
            <p>{ReactEmoji.emojify(text)}</p>
            <span class="time_date">me</span> </div>
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
        ) : null
      )
  );
}

export default Message;