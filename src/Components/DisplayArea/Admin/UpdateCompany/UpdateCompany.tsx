import { Button } from "@material-ui/core";
import { Build } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CompanyModel from "../../../../Models/CompanyModel";
import { ClientType } from "../../../../Models/UserModel";
import { companiesDownloadedAction, CompanyAction, companyUpdatedAction } from "../../../../Redux/CompanyState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import CompanyCard from "../CompanyCard/CompanyCard";
import "./UpdateCompany.css";

interface UpdateCompanyProps {
    company: CompanyModel;
}
/**
 * Displays all companies and allows updating any of them.
 */
function UpdateCompany(props: UpdateCompanyProps): JSX.Element {
    let history = useHistory();
    let [companies, setCompanies] = useState<CompanyModel[]>(store.getState().companyState.companies);

        let goToForm = (company: CompanyModel) => {
            history.push("/admin/update/company/" + company.id);
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
            notify.error("Please log in");
            history.push("/login/admin");
        }
         // If the companyState is somehow empty, gets the companies from the database
        else if (store.getState().companyState.companies.length === 0) {
            getCompanies();
        }
        return function cleanup() {unSubscribeMe();}
    }, []);
    return (
        <div className="UpdateCompany ScrollerDowner">
            {console.log(store.getState().companyState.companies)}
            {companies.map(comp => (<CompanyCard key={comp.id} company={comp} handle={goToForm} children={<Build/>} />
            ))}

            <br />
            <NavLink to="/administrator/display">
                <Button variant="contained" color="primary"> Back</Button>
            </NavLink>
        </div>
    );
}

export default UpdateCompany;
