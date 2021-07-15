import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, Typography, IconButton } from "@material-ui/core";
import { Add, ArrowBack } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { customerUpdatedAction } from "../../../../Redux/CustomersState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./UpdateCustomerForm.css";

interface RouteParams {
    id: string;
}

interface UpdateCustomerFormProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles({
    root: {
        position: "absolute",
        left: "82%",
        top: "15%",
        "&:hover": {
            backgroundColor: "transparent"
        }
    }
})

/**
 * Displays a form to update the selected customer. Only changed values will be updated.
 */
function UpdateCustomerForm(props: UpdateCustomerFormProps): JSX.Element {
    let [customer, setCustomer] = useState<CustomerModel>(() => store.getState().customerState.customers.find((c) => (
        c.id === parseInt(props.match.params.id))));
    let [passwordShown, setPasswordShown] = useState(false);
    let { handleSubmit, register } = useForm<CustomerModel>();
    let history = useHistory();
    const classes = useStyles();

    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };

    /**
     * Checks if the values on the form have been changed. If they haven't, sets them to their current value. 
     * @param customerToUpdate 
     */
    let checkIfChanged = (customerToUpdate: CustomerModel) => {
        if (!customerToUpdate.firstName) { customerToUpdate.firstName = customer.firstName; }
        if (!customerToUpdate.lastName) { customerToUpdate.lastName = customer.lastName; }
        if (!customerToUpdate.email) { customerToUpdate.email = customer.email; }
        if (!customerToUpdate.password) { customerToUpdate.password = customer.password; }
    }

    /**
    * Sets the value and id to its current value, checks if the other values have been changed, 
    * and then sends the company to the server to be updated.
    * @param customerToUpdate 
    */
    let handleUpdate = async (customerToUpdate: CustomerModel) => {
        try {
            customerToUpdate.id = customer.id;
            checkIfChanged(customerToUpdate);
            let response = await jwtAxios.put<CustomerModel>(globals.urls.updateCustomer, customerToUpdate);
            let updatedCustomer = response.data;
            store.dispatch(customerUpdatedAction(updatedCustomer));
            notify.success("Customer " + updatedCustomer.firstName + " " + updatedCustomer.lastName + " has been updated")
            history.push("/administrator/display");
        } catch (error) {
            notify.error(error);
        }
    }
    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in");
            history.push("/login/admin")
            // Insures a refresh does not crash the site by using a local storage
        } else if (customer === undefined) {
            //      downloads from local storage
            let storageCustomer = localStorage.getItem("storage-customer");
            if (storageCustomer !== 'undefined' && storageCustomer !== 'null') {
                setCustomer(JSON.parse(storageCustomer));
            }
        } else {
            // sends to local storage
            localStorage.setItem("storage-customer", JSON.stringify(customer));
        }

    })
    return (
        <div className="UpdateCustomerForm">

            <div className="updateForm">
                {customer &&
                    <form onSubmit={handleSubmit(handleUpdate)} >
                        <Typography variant="h6">Update Customer</Typography>
                        <br />
                        <FormControl>
                            <InputLabel >Customer First Name</InputLabel>
                            <Input id="firstName" defaultValue={customer.firstName} type="text"  {...register("firstName")} inputProps={{ minLength: 3, maxLength: 20 }} required />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Customer Last Name</InputLabel>
                            <Input id="lastName" defaultValue={customer.lastName} type="text"  {...register("lastName")} inputProps={{ minLength: 3, maxLength: 20 }} required />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Customer Email</InputLabel>
                            <Input id="email" defaultValue={customer.email} type="email"  {...register("email")} required />
                        </FormControl>
                        <br />
                        <FormControl>
                            <InputLabel >Company Password</InputLabel>
                            <Input id="password" defaultValue={customer.password} type={passwordShown ? "text" : "password"} {...register("password")} inputProps={{ minLength: 3, maxLength: 15 }} required />
                            <IconButton className={classes.root} onClick={togglePasswordVisiblity}>{<VisibilityIcon />}</IconButton>
                        </FormControl>
                        <br />
                        <br />
                        <Button type="submit" variant="contained" color="primary">   Update &nbsp;<Add /> </Button>
                        <NavLink to="/administrator/display">
                            <Button variant="contained">Back &nbsp; <ArrowBack /> </Button>
                        </NavLink>
                    </form>
                }
            </div>
        </div>
    );
}

export default UpdateCustomerForm;
