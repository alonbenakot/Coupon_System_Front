import { Card, CardHeader, IconButton } from "@material-ui/core";
import { red } from "@material-ui/core/colors";
import { Delete } from "@material-ui/icons";
import { ReactNode } from "react";
import { useHistory } from "react-router";
import CompanyModel from "../../../../Models/CompanyModel";
import { companyDeletedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./CompanyCard.css";

interface CompanyCardProps {
	company: CompanyModel;
    children: ReactNode;
    handle: Function;

}

function CompanyCard(props: CompanyCardProps): JSX.Element {
    return (
        <div className="CompanyCard">
			<Card key={props.company.id}>
                   <CardHeader action= {
                       <IconButton onClick={() => props.handle(props.company) }> {props.children} </IconButton>
                   }
                   title={props.company.name}
                   subheader={"Contact info: " + props.company.email}/>
               </Card>
        </div>
    );
}

export default CompanyCard;
