import { Button, FormControl, FormHelperText, Input, InputLabel, IconButton, Typography, makeStyles } from "@material-ui/core";
import { Add, ArrowBack } from "@material-ui/icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CustomerModel from "../../../../Models/CustomerModel";
import { ClientType } from "../../../../Models/UserModel";
import { customerAddedAction } from "../../../../Redux/CustomersState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./AddCustomer.css";

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
 *  Displays a form which allows the admin to add a customer.
 */
function AddCustomer(): JSX.Element {
    let { handleSubmit, register } = useForm<CustomerModel>();
    let history = useHistory();

    let [passwordShown, setPasswordShown] = useState(false);
    const classes = useStyles();

    let togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
    };


    useEffect(() => {
        if (store.getState().authState.user?.clientType === ClientType.CUSTOMER ||
            store.getState().authState.user?.clientType === ClientType.COMPANY) {
            notify.error("Please log in");
            history.push("/login/admin")
        }
    })

    /**
     * Receives the company data from the form. The function then sends the company
     * as FormData to the server. 
     * @param customer 
     */
    async function send(customer: CustomerModel) {
        try {
            let response;
            let addedCustomer;
            if (store.getState().authState.user?.clientType === ClientType.ADMINISTRATOR) {
                response = await jwtAxios.post<CustomerModel>(globals.urls.addCustomer, customer);
                addedCustomer = response.data;
                store.dispatch(customerAddedAction(addedCustomer));
                notify.success("Customer " + addedCustomer.firstName + " " + addedCustomer.lastName + "  added");
                history.push("/administrator/display");
            } else {
                response = await axios.post<CustomerModel>(globals.urls.guestAddCustomer, customer);
                addedCustomer = response.data;
                notify.success("Customer " + addedCustomer.firstName + " " + addedCustomer.lastName + "  added");
                history.push("/login/customer");
            }
        } catch (error) {
            notify.error(error);
        }
    }


    return (
        <div className="AddCustomer">
            <form title="Add a Customer" onSubmit={handleSubmit(send)} >
                <Typography variant="h6">Add a Customer</Typography>
                <FormControl>
                    <InputLabel>Customer First Name</InputLabel>
                    <Input id="firstName" {...register("firstName")} inputProps={{ minLength: 3, maxLength: 20 }} required />
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel>Customer Last Name</InputLabel>
                    <Input id="lastName" {...register("lastName")} inputProps={{ minLength: 3, maxLength: 20 }} required />
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel>Customer Email</InputLabel>
                    <Input id="email" type="email" {...register("email")} required />
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel>Customer Password</InputLabel>
                    <Input id="password" type={passwordShown ? "text" : "password"}  {...register("password")} inputProps={{ minLength: 3, maxLength: 15 }} required />
                    <IconButton className={classes.root} onClick={togglePasswordVisiblity}>{<VisibilityIcon />}</IconButton>
                    <FormHelperText>Make sure to write it down!</FormHelperText>
                </FormControl>
                <br />
                <br />
                <Button type="submit" variant="contained" color="primary">   Add &nbsp;<Add /> </Button>
                <NavLink to={store.getState().authState.user?.clientType === ClientType.ADMINISTRATOR ? "/administrator/display" : "/home"}>
                    <Button variant="contained">Back &nbsp; <ArrowBack /> </Button>
                </NavLink>
            </form>

        </div>
    );
}

export default AddCustomer;
