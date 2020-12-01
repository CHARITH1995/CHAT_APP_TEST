import React, { useEffect  } from 'react';
import { Link , withRouter , useHistory } from 'react-router-dom';
import onlineIcon from '../../icons/onlineIcon.png';
import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ userName , show }) => {
  
  return (
    <div class="infoBar">
      <div class="leftInnerContainer">
        {/* <img class="onlineIcon" src={onlineIcon} alt="online icon" /> */}
        <h3>Hello {userName} !</h3>
      </div>
      <div class="rightInnerContainer">
        
      </div>
    </div>
  );

}

export default InfoBar;