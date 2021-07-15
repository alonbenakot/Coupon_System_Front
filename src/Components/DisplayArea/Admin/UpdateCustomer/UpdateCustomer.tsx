import { Button } from "@material-ui/core";
import { Build, SettingsBackupRestoreSharp } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { customersDownloadedAction } from "../../../../Redux/CustomersState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import CompanyCard from "../CompanyCard/CompanyCard";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./UpdateCustomer.css";

interface UpdateCustomerProps {
    customer: CustomerModel;
}

/**
 * Displays all customers and allows updating any of them.
 */
function UpdateCustomer(props: UpdateCustomerProps): JSX.Element {
    let history = useHistory();
    let [customers, setCustomers] = useState<CustomerModel[]>(store.getState().customerState.customers);

    let goToForm = (customer: CustomerModel) => {
        history.push("/admin/update/customer/" + customer.id);
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
        let unSubscribeMe = store.subscribe(() => {
            setCustomers(store.getState().customerState.customers);
        })
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in")
            history.push("/login/admin");
        }
        // If the companyState is somehow empty, gets the companies from the database
        else if (store.getState().customerState.customers.length === 0) {
            getCustomers();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    }, [])
    return (
        <div className="UpdateCustomer ScrollerDowner">
            {customers.map(c => <CustomerCard key={c.id} customer={c} handle={goToForm} children={<Build />} />
            )}
            <br />
            <NavLink to="/administrator/display">
                <Button variant="contained" color="primary"> Back</Button>
            </NavLink>
        </div>
    );
}

export default UpdateCustomer;
