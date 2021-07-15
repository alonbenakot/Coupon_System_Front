import { Button, Card, CardHeader } from "@material-ui/core";
import { NavLink } from "react-router-dom";
import "./OperationCard.css";

interface OperationCardProps {
	operation: string;
}

function OperationCard(props: OperationCardProps): JSX.Element {
    return (
        <div className="OperationCard  ">
            <Card>
                <CardHeader title={props.operation}/>
            </Card>
           
        </div>
    );
}

export default OperationCard;
