import { Button } from "@material-ui/core";
import { Delete, Unsubscribe } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { customerDeletedAction, customersDownloadedAction } from "../../../../Redux/CustomersState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import CustomerCard from "../CustomerCard/CustomerCard";
import "./DeleteCustomer.css";

/**
 * Displays all customers and allows deleting any of them.
 */
function DeleteCustomer(): JSX.Element {
    let history = useHistory();
    let [customers, setCustomers] = useState<CustomerModel[]>(store.getState().customerState.customers);

    /**
     * Passed on to the customer card. Deletes the customer from the database and updates the customersState.
     * @param company 
     */
    let handleDelete = async (customer: CustomerModel) => {
        await jwtAxios.delete<number>(globals.urls.deleteCustomer + customer.id);
        store.dispatch(customerDeletedAction(customer));
        notify.success("Customer " + customer.firstName + " " + customer.lastName + " has been deleted.");
        history.push("/admin/delete/customer");
    }

    /**
     * Gets all the companies from the database and dispatches them to the store.
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
            notify.error("Pleas log in");
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
        <div className="DeleteCustomer ScrollerDowner">
			{customers.map(customerToDelete => (<CustomerCard key={customerToDelete.id} customer={customerToDelete} handle={handleDelete} children={<Delete/>}/>))}
            <br/>
            <br/>
            <NavLink to="/administrator/display">
                <Button variant="contained" color="primary"> Back</Button>
            </NavLink>
        </div>
    );
}

export default DeleteCustomer;
