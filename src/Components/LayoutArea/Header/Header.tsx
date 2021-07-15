import { Typography } from "@material-ui/core";
import { Component } from "react";
import { NavLink } from "react-router-dom";
import { ClientType } from "../../../Models/UserModel";
import AuthCustomer from "../../AuthArea/AuthCustomer/AuthCustomer";
import Login from "../../AuthArea/Login/Login";
import MyArea from "../../DisplayArea/MyArea/MyArea";
import "./Header.css";

class Header extends Component {

    public render(): JSX.Element {
        return (
            <div className="Header">
                <br/>
				<Typography variant="h4"> Coupon Wonder Land </Typography>
               <span className="menu"> <AuthCustomer/> </span> 
               <span className="user-area"> <MyArea/> </span>
            </div>
        );
    }
}

export default Header;
