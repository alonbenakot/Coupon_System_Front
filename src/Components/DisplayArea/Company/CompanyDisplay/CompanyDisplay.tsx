import { Home } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponDeletedAction, couponsDowloadedAction as couponsDownloadedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import CouponCard from "../../../CouponsArea/CouponCard/CouponCard";
import OperationCard from "../../OperationCard/OperationCard";
import "./CompanyDisplay.css";
import { useForm } from "react-hook-form";

const useStyles = makeStyles((theme) => ({
    form: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

/**
 * Displays the company coupons and the available operations for each coupon. 
 */
function CompanyDisplay(): JSX.Element {
    type filterDetails = { category: Category, maxPrice: number };
    let history = useHistory();
    let [coupons, setCoupons] = useState<CouponModel[]>();
    let [couponsFetched, setCouponsFetched] = useState<boolean>(false);
    let [categoryValue, setCategoryValue] = useState(null);
    let [priceValue, setPriceValue] = useState(null);
    let [details, setDetails] = useState<filterDetails>(null);
    const { handleSubmit, register } = useForm<filterDetails>();
    const classes = useStyles();

    const send = (filter: filterDetails) => {
        setDetails(filter);
    };

    const clearFilter = () => {
        setDetails(null);
        setCategoryValue(null)
        setPriceValue(null)
    };

    const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategoryValue(event.target.value as Category);
    };
    const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPriceValue(event.target.value as number);
    };

    /**
     * Deletes the selected coupon by sending the coupon id to the server and updates the store.
     * @param coupon 
     */
    let handleDelete = async (coupon: CouponModel) => {
        try {
            await jwtAxios.delete<number>(globals.urls.deleteCoupon + coupon.id);
            store.dispatch(couponDeletedAction(coupon));
            notify.success("Coupon " + coupon.title + " deleted.");
            history.push("/company/display");
        } catch (error) {
            notify.error(error);
        }
    }

    let goToUpdateForm = (id: string) => {
        history.push("/company/update/coupon/" + id)
    }

    /**
     * Filters the coupons based on the details from the filter form: category and max price.
     * @returns CouponModel[]
     */
    const showCoupons = (): CouponModel[] => {
        let filteredCoupons = coupons;
        if (details?.category !== undefined && details?.maxPrice !== undefined) {
            filteredCoupons = filteredCoupons.filter((c) =>
                (c.price <= details.maxPrice && c.category === details.category))
        }
        return filteredCoupons;
    }

    /**
     * Gets all the company coupons from the database and dispatches them to the store.
     * Sets the couponsFetched flag to true in order to insure the method works only once on the first render.
     */
    async function getCoupons() {
        try {
            let response = await jwtAxios.get<CouponModel[]>(globals.urls.getCompanyCoupons);
            store.dispatch(couponsDownloadedAction(response.data));
            setCouponsFetched(true)
        } catch (error) {
            notify.error(error);
        }
    }
    useEffect(() => {
        let unSubscribeMe = store.subscribe(() => {
            setCoupons(store.getState().couponState.coupons);
        });
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please log in");
            history.push("/login/company");
        } else if (!couponsFetched) {
            getCoupons();
        }
        return function cleanup() { unSubscribeMe(); }
    }, [])
    return (
        <div className="CompanyDisplay ScrollerDowner">
            <Typography variant="h4" > {store.getState().authState.user.name}'s Coupons </Typography>
            <NavLink className="addButton" to="/company/add/coupon"><OperationCard operation="Add Coupon" /></NavLink>
            <br />
            <NavLink className="homeButton" to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="contained">Home</Button>
            </NavLink>
            <br />
            <form className="filterForm" onSubmit={handleSubmit(send)} >
                <FormControl className={classes.form}>
                    <InputLabel>Coupon Category</InputLabel>
                    <Select
                        {...register("category")}
                        required
                        labelId="labelIdCategories"
                        id="categoriesId"
                        value={!categoryValue ? "" : categoryValue}
                        onChange={handleCategoryChange} >
                        <MenuItem value={null} >-</MenuItem>
                        <MenuItem value={Category.FOOD} >Food</MenuItem>
                        <MenuItem value={Category.ELECTRICITY} >Electricity</MenuItem>
                        <MenuItem value={Category.RESTAURANT} >Restaurant</MenuItem>
                        <MenuItem value={Category.VACATION} >Vacation</MenuItem>
                        <MenuItem value={Category.HYGIENE_PRODUCTS} >Hygiene Products</MenuItem>
                        <MenuItem value={Category.TRANSPORT} >Transport</MenuItem>
                        <MenuItem value={Category.MAGIC} >Magic</MenuItem>
                    </Select>
                </FormControl> <br />
                <FormControl>
                    <InputLabel>Coupon Price</InputLabel>
                    <Input id="price" required type="number" value={!priceValue ? "" : priceValue}  {...register("maxPrice")} onChange={handlePriceChange} />
                </FormControl>
                <br />
                <br />

                <Button type="submit" variant="contained" size="small" color="primary">Filter &nbsp; </Button>
                <Button onClick={clearFilter} variant="contained" size="small">Clear &nbsp;</Button>
            </form>
            {
                coupons && showCoupons().filter((coup) => (
                    //show only coupons that belong to this company via company id
                    coup.company.id === store.getState().authState.user.id
                )).map((coup) => (<CouponCard key={coup.id} coupon={coup} handleD={handleDelete} handleU={goToUpdateForm} />
                ))}
        </div>
    );
}


export default CompanyDisplay;
