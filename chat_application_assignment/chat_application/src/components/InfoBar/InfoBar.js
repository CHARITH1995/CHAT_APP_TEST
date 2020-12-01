import React, { useEffect } from 'react';

import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ userName }) => {

  // useEffect(()=>{
  //   console.log(userName)
  // })
  return (
    <div class="infoBar">
      <div class="leftInnerContainer">
        {/* <img class="onlineIcon" src={onlineIcon} alt="online icon" /> */}
        <h3>Hello {userName} !</h3>
      </div>
      <div class="rightInnerContainer">
        {/* <a href="/Home"><img src={closeIcon} alt="close icon" /></a> */}
      </div>
    </div>
  );

}

export default InfoBar;