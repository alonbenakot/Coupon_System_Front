import { useHistory } from "react-router";
import { useForm } from "react-hook-form";
import CredentialsModel from "../../../Models/CredentialsModel";
import "./Login.css";
import axios from "axios";
import { Button, FormControl, Input, InputLabel, makeStyles, IconButton, ButtonGroup } from "@material-ui/core";
import globals from "../../../Services/Globals";
import UserModel, { ClientType } from "../../../Models/UserModel";
import store from "../../../Redux/Store";
import { loginAction } from "../../../Redux/AuthState";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { NavLink } from "react-router-dom";
import { ArrowBack, LockOpen } from "@material-ui/icons";
import notify from "../../../Services/Notifications";
import { useState } from "react";

interface LoginProps {
    type: ClientType;
}

const useStyles = makeStyles({
    root: {
        position: "absolute",
        right: "1%",
        top: "20%",
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
})
/**
 * Submits user credentials to the server in order to validate user.
 * If validated, dispatches the user details to the autState and transfers the user to his personal area.
 * @param props Client type
 * 
 */
function Login(props: LoginProps): JSX.Element {
    let history = useHistory();
    const classes = useStyles();
    let { register, handleSubmit } = useForm<CredentialsModel>();
    let [passwordShown, setPasswordShown] = useState(false);
    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    /**
     * Manipulates a string, making each word begin with a capital letter followed by lower case letters.
     * @param typeName 
     * @returns string
     */
    function niceString(typeName: string): string {
        typeName = typeName.toLowerCase();
        typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typeName = typeName.replace('_', ' ')
        let words = typeName.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");
    }

    /**
     * Passes the user credentials from the submitted form along with the client type to the server.
     * @param credentials 
     */
    async function send(credentials: CredentialsModel) {
        if (store.getState().authState.user) {
            notify.error('You are already logged in. Please log out.')
        }
        else {
            let credentialsUrl = "?email=" + credentials.email + "&password=" + credentials.password;

            switch (props.type) {
                case ClientType.ADMINISTRATOR:
                    credentialsUrl += "&type=" + ClientType.ADMINISTRATOR;
                    break;
                case ClientType.COMPANY:
                    credentialsUrl += "&type=" + ClientType.COMPANY;
                    break;
                case ClientType.CUSTOMER:
                    credentialsUrl += "&type=" + ClientType.CUSTOMER;
                    break;
            }
            try {
                let response = await axios.post<UserModel>(globals.urls.login + credentialsUrl
                );
                store.dispatch(loginAction(response.data));
                notify.success("You have been successfully logged in!");
                history.push("/" + props.type.toString().toLowerCase() + "/display");
            } catch (error) {
                notify.error(error);
            }
        }
    }
    return (
        <div className="Login ">
            <h2>Login as {niceString(props.type)}</h2>
            <form onSubmit={handleSubmit(send)}>
                <FormControl>
                    <InputLabel>Email</InputLabel>
                    <Input id="email" {...register("email")} type="email"  required/>
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel>Password</InputLabel>
                    <Input id="password" {...register("password")} type={passwordShown ? "text" : "password"} required />
                    <IconButton className={classes.root} onClick={togglePasswordVisiblity}>{<VisibilityIcon />}</IconButton>
                </FormControl>
                <br />
                <br />
                <ButtonGroup variant="contained" >
                    <Button type="submit" startIcon={<LockOpen />} style={{ textTransform: "none" }} color="primary">Login</Button>
                    <NavLink to="/home">
                        <Button startIcon={<ArrowBack />} style={{ textTransform: "none" }} variant="contained" color="inherit">Back</Button>
                    </NavLink>
                </ButtonGroup>
            </form>

        </div>
    );

}
export default Login;
