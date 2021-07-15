import { useEffect } from "react";
import { useHistory } from "react-router";
import { logoutAction } from "../../../Redux/AuthState";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notifications";
import "./Logout.css";

/**
 * Logs the user out and dispatches the store accordingly. 
 * @returns 
 */
function Logout(): JSX.Element {
    let history = useHistory();

    useEffect(() => {
        store.dispatch(logoutAction())
        notify.success("You are now logged out.");
        history.push("/home")
    });

    return (<></>);
}

export default Logout;
