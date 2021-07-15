import { NavLink, useHistory, useLocation } from "react-router-dom";
import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core";
import { Filter3, Home } from "@material-ui/icons";
import "./CustomerDisplay.css";
import { useState } from "react";
import store from "../../../../Redux/Store";
import jwtAxios from "../../../../Services/jwtAxios";
import globals from "../../../../Services/Globals";
import { customerAddedAction, customersDownloadedAction } from "../../../../Redux/CustomersState";
import notify from "../../../../Services/Notifications";
import { useEffect } from "react";
import CouponCard from "../../../CouponsArea/CouponCard/CouponCard";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { useForm } from "react-hook-form";
import CustomerModel from "../../../../Models/CustomerModel";
import { couponAddedAction } from "../../../../Redux/CouponsState";
import { log } from "console";

const useStyles = makeStyles((theme) => ({
    form: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))

/**
 * Displays the coupons bought by the customer. 
 */
function CustomerDisplay(): JSX.Element {
    type filterDetails = { category: Category, maxPrice: number };
    let [customerFetched, setCustomerFetched] = useState<boolean>(false);
    let [customer, setCustomer] = useState<CustomerModel>();
    let [categoryValue, setCategoryValue] = useState(null);
    let [priceValue, setPriceValue] = useState(null);
    let [details, setDetails] = useState<filterDetails>(null);

    const classes = useStyles();
    const history = useHistory();
    const location = useLocation();
    const { handleSubmit, register } = useForm<filterDetails>();

    /**
     * Gets the customer details from the server, sets the customer state and dispatches them to the store. 
     * Also dispatches to the store all of the customer's coupons.
     */
    const getCustomer = async () => {
        try {
            let response = await jwtAxios.get<CustomerModel>(globals.urls.getCustomerDetails);
            setCustomer(response.data);
            store.dispatch(customerAddedAction(response.data));
            customer?.coupons.forEach(coupon => {
                store.dispatch(couponAddedAction(coupon))
            });
            setCustomerFetched(true) // insures the request is sent only once to the server
        } catch (error) {
            notify.error(error)
        }
    }

    const send = (filter: filterDetails) => {
        setDetails(filter);
    };

    const clearFilter = () => {
        setDetails(null);
        setCategoryValue(null)
        setPriceValue(null)
    };

    
    /**
     *  Show coupons based on the filters the user filled in the form.
     * @returns CouponModel[]
     */
    const showCoupons = (): CouponModel[] => {
        let filteredCoupons = customer.coupons;
        if (details?.category !== undefined && details?.maxPrice !== undefined) {
            filteredCoupons = filteredCoupons.filter((c) =>
                (c.price <= details.maxPrice && c.category === details.category))
        }
        return filteredCoupons;
    }

    const handleCategoryChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setCategoryValue(event.target.value as Category);
    };
    const handlePriceChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPriceValue(event.target.value as number);
    };


    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.CUSTOMER) {
            notify.error("Please log in");
            history.push("/login/company");
        } else if (!customerFetched) {
            getCustomer();
        }
    }, [customer])
    
    return (
        <div className="CustomerDisplay ScrollerDowner">
            <form id="myForm" className="filterForm" onSubmit={handleSubmit(send)} >
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
                    {/* <Input required id="price" type="number" value={!priceValue ? "" : priceValue} {...register('maxPrice')} onChange={handlePriceChange} /> */}

                </FormControl>
                <br />
                <br />

                <Button type="submit" variant="contained" size="small" color="primary">Filter &nbsp; </Button>
                <Button onClick={clearFilter} variant="contained" size="small">Clear &nbsp;</Button>
            </form>
            <NavLink className="homeButton" to="/home">
                <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="contained">Home</Button>
            </NavLink>
            <Typography variant="h4" display="inline"> {store.getState().authState.user.name}'s Coupons </Typography>
            <br />
            {customer?.coupons && showCoupons().map((c) =><CouponCard key={c.id} coupon={c} />)}
            <br />
        </div>
    );
}

export default CustomerDisplay;
