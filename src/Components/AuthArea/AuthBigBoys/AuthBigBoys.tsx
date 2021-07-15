import { NavLink } from "react-router-dom";
import "./AuthBigBoys.css";

/**
 * Allows logging in as an admin or a company.
 * 
 */
function AuthBigBoys(): JSX.Element {
    return (
        <div className="AuthBigBoys">
           <span> Log in as&nbsp;</span> 
			<NavLink to="/login/admin">Admin</NavLink>
            &nbsp; | &nbsp;
			<NavLink to="/login/company">Company</NavLink> 
        </div>
    );
}

export default AuthBigBoys;
