import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, Typography, IconButton } from "@material-ui/core";
import  VisibilityIcon  from "@material-ui/icons/Visibility";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companyUpdatedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./UpdateCompanyForm.css";

interface RouteParams {
    id: string;
}
interface UpdateCompanyFormProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles({
    root:{
        position: "absolute",
        right: "2%",
        top: "23%",
        "&:hover":{
            backgroundColor:"transparent"
        }
    }
})

/**
 * Displays a form to update the selected company. Only changed values will be updated.
 */
function UpdateCompanyForm(props: UpdateCompanyFormProps): JSX.Element {
    const classes = useStyles();
    let [passwordShown, setPasswordShown] = useState(false);
    let [company, setCompany] = useState<CompanyModel>(() => store.getState().companyState.companies.find((c) => (
        c.id === parseInt(props.match.params.id))));
    let { handleSubmit, register } = useForm<CompanyModel>();
    const history = useHistory();

    const togglePasswordVisiblity = () => {
        setPasswordShown(passwordShown ? false : true);
      };


    /**
     * Checks if the values on the form have been changed. If they haven't, sets them to their current value. 
     * @param companyToUpdate 
     */
    const checkIfChanged = (companyToUpdate: CompanyModel) => {
        if (!companyToUpdate.email) { companyToUpdate.email = company.email; }
        if (!companyToUpdate.password) { companyToUpdate.password = company.password; }
    }

    /**
     * Sets the values and id and name to their current values, checks if the other values have been changed, 
     * and then sends the company to the server to be updated.
     * @param companyToUpdate 
     */
    const handleUpdate = async (companyToUpdate: CompanyModel) => {
        try {
            companyToUpdate.id = company.id;
            companyToUpdate.name = company.name;
            checkIfChanged(companyToUpdate);
            let response = await jwtAxios.put<CompanyModel>(globals.urls.updateCompany, companyToUpdate);
            let updatedCompany = response.data;
            console.log(updatedCompany);
            store.dispatch(companyUpdatedAction(updatedCompany));
            notify.success("Company" + company.name + " has been updated updated");
            history.push("/admin/update/company")
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Please log in");
            history.push("/login/admin")

            // Insures a refresh does not crash the site by using a local storage
        } else if (company === undefined) {
            // downloads from local storage 
                let storageCompany = localStorage.getItem("storage-company");
                if (storageCompany !== 'undefined' && storageCompany !== 'null') {
                    setCompany(JSON.parse(storageCompany));
                }
            } else {
                // sends to local storage
                localStorage.setItem("storage-company", JSON.stringify(company));
        }


    })
    return (
        <div className="UpdateCompanyForm">
            <Typography variant="h5">Update Company</Typography>

            <div className="updateForm">
            { company && 
                <form onSubmit={handleSubmit(handleUpdate)} >
                    <br />
                    <FormControl>
                        <InputLabel >Company Email</InputLabel>
                        <Input id="email" defaultValue={company.email} type="email"  {...register("email")} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Company Password</InputLabel>
                        <Input id="password" defaultValue={company.password} inputProps={{minLength: 3,  maxLength: 15}} type={passwordShown ? "text" : "password"}
                            {...register("password")} />
                        <IconButton className={classes.root} onClick={togglePasswordVisiblity}>{<VisibilityIcon />}</IconButton>
                    </FormControl>
                    <br />
                    <br />
                    <Button type="submit" variant="contained" color="primary">   Update </Button>
                    <NavLink to="/admin/update/company">
                        <Button variant="contained">Back &nbsp;  </Button>
                    </NavLink>
                </form>
            }
            </div>
        </div>
    );
}

export default UpdateCompanyForm;
