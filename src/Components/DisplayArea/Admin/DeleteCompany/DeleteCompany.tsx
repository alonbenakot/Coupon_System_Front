import { Button, Card, CardHeader, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction, companyDeletedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import CompanyCard from "../CompanyCard/CompanyCard";

/**
 * Displays all companies and allows deleting any of them.
 */
function DeleteCompany(): JSX.Element {
    let history = useHistory();
    let [companies, setCompanies] = useState<CompanyModel[]>(store.getState().companyState.companies);

    /**
     * Passed on to the company card. Deletes the company from the database and updates the companiesState.
     * @param company 
     */
    let handleDelete = async (company: CompanyModel) => {
        try {
            await jwtAxios.delete<number>(globals.urls.deleteCompanies + company.id);
            store.dispatch(companyDeletedAction(company));
            notify.success("Company " + company.name + " deleted.");
            history.push("/admin/delete/company");
        } catch (error) {
            notify.error(error);
        }
        
    }
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
    useEffect(() => {
        let unSubscribeMe = store.subscribe(() => {
            setCompanies(store.getState().companyState.companies);
        })
        if (store.getState().authState.user?.clientType !== ClientType.ADMINISTRATOR) {
            notify.error("Pleas log in");
            history.push("/login/admin");
        }
        // If the companyState is somehow empty, gets the companies from the database
        else if(store.getState().companyState.companies.length === 0 ) {
            getCompanies();
        }
        return function cleanup() {
            unSubscribeMe();
        }
    },[]);
    return (
        <div className="DeleteCompany ScrollerDowner">
            {console.log(store.getState().companyState.companies)}
            {companies.map(company => ( <CompanyCard key={company.id} company={company} handle={handleDelete} children={<Delete/>}/>
                ))}
                <br/>
            <br/>
            <NavLink to="/administrator/display">
                <Button variant="contained" color="primary"> Back</Button>
            </NavLink>

        </div>
    );
}

export default DeleteCompany;
