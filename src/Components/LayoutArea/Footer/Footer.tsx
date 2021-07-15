import { Typography } from "@material-ui/core";
import { Component } from "react";
import AuthBigBoys from "../../AuthArea/AuthBigBoys/AuthBigBoys";
import "./Footer.css";

class Footer extends Component {

    public render(): JSX.Element {
        return (
            <div className="Footer">
                <Typography variant="h5"> &copy; Alon Benakot 2021 </Typography>
                <span>
                    <AuthBigBoys/>
                </span>
            </div>
        );
    }
}

export default Footer;
