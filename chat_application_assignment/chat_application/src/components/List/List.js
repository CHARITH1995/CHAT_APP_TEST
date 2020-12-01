import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';
import { withRouter, Link } from "react-router-dom";
import { MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";
import './List.css';


const ChatList = ({ userList, onlineList }) => {

    const [loggedUser, setLoggedUser] = useState(jwt_decode(localStorage.getItem('token')))

    // useEffect(() => {
    //     console.log("list",JSON.stringify(onlineList))

    // }, [onlineList])

    return (
        <div className="NBbackground">
            <div id="sidebar-wrapper">
                <nav id="spy">
                    <ul className="sidebar-nav nav">
                        <li className="sidebar-brand">
                            <a href="#"><span className="NBbrand">CHAT APP</span></a>

                        </li>
                        {
                            onlineList && onlineList.map((user, index) =>
                                user.email !== loggedUser.email ? (
                                    <li key={index} className="item-class">
                                        <Link to={`/chat?id=${user.id},email=${user.email}&firstName=${user.firstName}&lastName=${user.lastName}`}>
                                            <div className="inner-items">
                                                <span className="NBlink">{user.firstName}{" "}{user.lastName}</span>
                                            {
                                                onlineList.find((onlineUser) => onlineUser.email == user.email) ? (
                                                    <span className="dot"></span>
                                                ) : null
                                            }
                                            </div>
                                            </Link>
                                    </li>
                                ) : null

                            )
                        }
                        {/* <li class="item-class">
                            <a href="/profile" >
                                <div class="inner-items">
                                    <span className="NBlink">Amila Aponso</span>
                                    <span class="dot"></span>
                                </div>
                            </a>
                        </li>
                        <li class="item-class">
                            <a href="/video" >
                                <div class="inner-items">
                                    <span className="NBlink">Kasun Hasintha</span>
                                    <span class="dot"></span>
                                </div>
                            </a>
                        </li> */}
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default withRouter(ChatList)