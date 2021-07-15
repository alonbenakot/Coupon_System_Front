import { Button } from "@material-ui/core";
import { AccountBox } from "@material-ui/icons";
import { useEffect } from "react";
import { useHistory } from "react-router";
import store from "../../../Redux/Store";
import notify from "../../../Services/Notifications";
import "./MyArea.css";

function MyArea(): JSX.Element {
    let history = useHistory();

    /**
     * If the user is logged in, transfers him to his personal area depending on his client type.
     *  */
    function isLoggedIn(): void {
        if (!store.getState().authState.user) {
            notify.error("You are not logged in. Please log in.")
            history.push("/home");
        }
        else {
            history.push("/" + store.getState().authState.user.clientType.toLowerCase() + "/display");
        }
    }
    return (
        <div className="MyArea">
            <Button onClick={isLoggedIn} startIcon={<AccountBox />} style={{ textTransform: "none" }} variant="contained" color="primary">My Area</Button>
        </div>
    );
}

export default MyArea;
