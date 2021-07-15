import { Button } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import { useState } from "react";
import { useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction } from "../../../../Redux/CompanyState";
import { customersDownloadedAction } from "../../../../Redux/CustomersState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import OperationCard from "../../OperationCard/OperationCard";
import "./AdminDisplay.css";

/**
 * Displays the available operations for the admin. 
 */
function AdminDisplay(): JSX.Element {
    let history = useHistory();
    let [compsAndCustsFetched, setCompsAndCustsFetched] = useState<boolean>(false);

    /**
     * Gets all the companies from the database and dispatches them to the store.
     */
    async function getCompanies() {
        try {
            let response = await jwtAxios.get<CompanyModel[]>(globals.urls.getCompanies);
            store.dispatch(companiesDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }
    /**
     * Gets all the customers from the database and dispatches them to the store.
     */
    async function getCustomers() {
        try {
            let response = await jwtAxios.get<CustomerModel[]>(globals.urls.getCustomers);
            store.dispatch(customersDownloadedAction(response.data));
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in");
            history.push("/login/admin");
            
            //Gets companies and customers for the first time
        } else if (!compsAndCustsFetched) {
                getCompanies();
                getCustomers();
                setCompsAndCustsFetched(true);
            }

        
    }, []);

    return (
        <div className="AdminDisplay">
            <br />
            <NavLink className="marginOpCard" to="/admin/add/company"><OperationCard operation="Add Company" /></NavLink>
            <NavLink className="marginOpCard" to="/admin/update/company"><OperationCard operation="Update Company" /></NavLink>
            <NavLink className="marginOpCard" to="/admin/delete/company"><OperationCard operation="Delete Company" /></NavLink>
            <br />
            <br />
            <br />
            <NavLink className="marginOpCard" to="/admin/add/customer"><OperationCard operation="Add Customer" /></NavLink>
            <NavLink className="marginOpCard" to="/admin/update/customer"><OperationCard operation="Update Customer" /></NavLink>
            <NavLink className="marginOpCard" to="/admin/delete/customer"><OperationCard operation="Delete Customer" /></NavLink>
            <br />
            <br />
            <NavLink to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="contained">Home</Button>
            </NavLink>

        </div>
    );
}

export default AdminDisplay;
