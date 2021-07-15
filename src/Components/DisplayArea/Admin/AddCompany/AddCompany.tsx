import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, Typography, IconButton } from "@material-ui/core";
import { Add, ArrowBack, Send } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companyAddedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import  VisibilityIcon  from "@material-ui/icons/Visibility";
import "./AddCompany.css";

const useStyles = makeStyles({
    root:{
        position: "absolute",
        left: "80%",
        top: "14%",
        "&:hover":{
            backgroundColor:"transparent"
        }
    }
})

/**
 * Displays a form which allows the admin to add a company. 
 */
function AddCompany(): JSX.Element {
    let { handleSubmit, register } = useForm<CompanyModel>();
    let history = useHistory();

    const classes = useStyles();
    let [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in");
            history.push("/login/admin")
        }
    })
    /**
     * Receives the company data from the form. The function then sends the company
     *  as FormData to the server. 
     * @param company 
     */
    async function send(company: CompanyModel) {
        try {
            
            let response = await jwtAxios.post<CompanyModel>(globals.urls.addCompany, company);
            let addedCompany = response.data;
            store.dispatch(companyAddedAction(addedCompany));
            notify.success(addedCompany.name + "Company added");
            history.push("/administrator/display");
        } catch (error) {
            notify.error(error);
        }
    }
    return (
        <div className="AddCompany ">
                <form onSubmit={handleSubmit(send)} >
                <Typography variant="h6">Add a Company</Typography>
                    <FormControl>
                        <InputLabel>Company Name</InputLabel>
                        <Input id="name" {...register("name")} required inputProps={{minLength: 3,  maxLength: 25}} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Company Email</InputLabel>
                        <Input id="email" type="email" {...register("email") } required/>
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel>Company Password</InputLabel>
                        <Input id="password" type={passwordShown ? "text" : "password"} {...register("password")} inputProps={{minLength: 3,  maxLength: 15}} required />
                        <FormHelperText>Make sure to write it down!</FormHelperText>
                        <IconButton className={classes.root} onClick={togglePasswordVisiblity}>{<VisibilityIcon />}</IconButton>
                    </FormControl>
                    <br />
                    <br />
                    <Button type="submit" variant="contained" color="primary">   Add &nbsp;<Add /> </Button>
                    <NavLink to="/administrator/display">
                        <Button variant="contained">Back &nbsp; <ArrowBack /> </Button>
                    </NavLink>
                </form>


        </div>
    );
}

export default AddCompany;
