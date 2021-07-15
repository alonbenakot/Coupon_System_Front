import { Button, FormControl, FormHelperText, Input, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core";
import { ArrowBack, Unsubscribe } from "@material-ui/icons";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { RouteComponentProps, useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponUpdatedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./UpdateCouponForm.css";

interface RouteParams {
    id: string;
}

interface UpdateCouponFormProps extends RouteComponentProps<RouteParams> { }

const useStyles = makeStyles((theme) => ({
    form: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))
/**
 * Displays a form to update the selected coupon. Only changed values will be updated.
 */
function UpdateCouponForm(props: UpdateCouponFormProps): JSX.Element {
    let { handleSubmit, register } = useForm<CouponModel>();
    const history = useHistory();
    const [value, setValue] = useState('');
    const classes = useStyles();
    let [coupon, setCoupon] = useState<CouponModel>(() => store.getState().couponState.coupons.find((c) => (
        c.id === +props.match.params.id)));
        console.log(coupon);

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value as Category);
    };

    /**
     * If certain inputs were not filled out, set their values to their current values
     * instead of them being erased.
     * @param couponToUpdate 
     */
    const checkIfChanged = (couponToUpdate: CouponModel) => {
        if (!couponToUpdate.title?.trim()) { couponToUpdate.title = coupon.title; }
        if (!couponToUpdate.amount) { couponToUpdate.amount = coupon.amount; }
        if (!couponToUpdate.category) { couponToUpdate.category = coupon.category; }
        if (!couponToUpdate.description) { couponToUpdate.description = coupon.description; }
        if (!couponToUpdate.endDate) { couponToUpdate.endDate = coupon.endDate; }
        if (!couponToUpdate.startDate) { couponToUpdate.startDate = coupon.startDate; }
        if (!couponToUpdate.price) { couponToUpdate.price = coupon.price; }
        if (!couponToUpdate.image.item(0)) { couponToUpdate.imageName = coupon.imageName; }
    }

    /**
     * Validates the dates before sending them to the server.
     * @param couponToUpdate
     * @returns true if dates are validated, false if they are not.
     */
    const valiDates = (couponToUpdate: CouponModel): boolean => {
        if (couponToUpdate.startDate > couponToUpdate.endDate) {
            notify.error('End Date cannot be before Start Date');
            return false;
        }
        return true;
    }

    /**
     * Receives the coupon data from the form. The function then makes sure that the 
     * fields are validated before sending the coupon to be updated as FormData to the server.
     * @param couponToUpdate 
     */
    const handleUpdate = async (couponToUpdate: CouponModel) => {
        try {
            couponToUpdate.id = coupon.id;
            couponToUpdate.company = coupon.company;
            checkIfChanged(couponToUpdate);
            if (!valiDates(couponToUpdate)) { return; }
            console.log('did i get here?');
            const myFormData = new FormData();

            myFormData.append("id", couponToUpdate.id.toString());
            myFormData.append("amount", couponToUpdate.amount.toString());
            myFormData.append("category", couponToUpdate.category.toString());
            myFormData.append("description", couponToUpdate.description);
            myFormData.append("endDate", new Date(couponToUpdate.endDate).toISOString().split("T")[0]);
            myFormData.append("price", couponToUpdate.price.toString());
            myFormData.append("startDate", new Date(couponToUpdate.startDate).toISOString().split("T")[0]);
            myFormData.append("title", couponToUpdate.title);
            myFormData.append("image", couponToUpdate.image.item(0));

            let response = await jwtAxios.put<CouponModel>(globals.urls.updateCoupon, myFormData);
            let updatedCoupon = response.data;
            store.dispatch(couponUpdatedAction(updatedCoupon));
            localStorage.removeItem("storage-coupon");
            notify.success("Coupon " + updatedCoupon.title + " has been updated");
            setTimeout(() => {
                history.push("/company/display");
            }, 1000);
        } catch (error) {
            notify.error(error);
        }
    }

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please log in");
            history.push("/login/company");
        } else {
            //      downloads from local storage
            if (coupon === undefined) {
                let storageCoupon = localStorage.getItem("storage-coupon");
                if (storageCoupon !== 'undefined' && storageCoupon !== 'null') {
                    setCoupon(JSON.parse(storageCoupon));
                }
            } else {
                // sends to local storage
                localStorage.setItem("storage-coupon", JSON.stringify(coupon));
            }
        }
    })


    return (
        <div className="UpdateCouponForm">
            {coupon &&
                <form title="Add a Customer" onSubmit={handleSubmit(handleUpdate)} >
                    <br />
                    <Typography variant="h6">Update a Coupon</Typography>
                    <br />
                    <FormControl>
                        <InputLabel>Coupon Title</InputLabel>
                        <Input id="title" defaultValue={coupon.title} {...register("title")} inputProps={{ maxLength: 20 }} />
                    </FormControl>
                    <br />
                    <FormControl className={classes.form}>
                        <InputLabel>Coupon Category</InputLabel>
                        <Select
                            {...register("category")}
                            labelId="labelIdCategories"
                            id="categoriesId"
                            value={!value ? coupon.category : value}
                            onChange={handleChange} >
                            <MenuItem value={Category.FOOD} >Food</MenuItem>
                            <MenuItem value={Category.ELECTRICITY} >Electricity</MenuItem>
                            <MenuItem value={Category.RESTAURANT} >Restaurant</MenuItem>
                            <MenuItem value={Category.VACATION} >Vacation</MenuItem>
                            <MenuItem value={Category.HYGIENE_PRODUCTS} >Hygiene Products</MenuItem>
                            <MenuItem value={Category.TRANSPORT} >Transport</MenuItem>
                            <MenuItem value={Category.MAGIC} >Magic</MenuItem>
                        </Select>
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel >Coupon Description</InputLabel>
                        <Input id="description" {...register("description")} />
                    </FormControl>
                    <br />
                    <FormControl className={classes.form}>
                        <InputLabel shrink>Coupon Start Date</InputLabel>
                        <Input id="startDate" defaultValue={coupon.startDate} type="date" fullWidth {...register("startDate")} />
                    </FormControl>
                    <br />
                    <FormControl className={classes.form}>
                        <InputLabel shrink>Coupon End Date</InputLabel>
                        <Input id="endDate" defaultValue={coupon.endDate} type="date" fullWidth {...register("endDate")} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel>Coupon Amount</InputLabel>
                        <Input id="amount" defaultValue={coupon.amount} type="number" inputProps={{ min: 1 }} {...register("amount")} />
                    </FormControl>
                    <br />
                    <FormControl>
                        <InputLabel>Coupon Price</InputLabel>
                        <Input id="price" defaultValue={coupon.price} type="number" inputProps={{ min: 0, step: "0.01" }} {...register("price")} />
                    </FormControl>
                    <br />
                    <br />
                    <Button
                        variant="contained"
                        component="label">
                        Upload Image
                        <input hidden type="file" name="image" {...register('image')} accept="image/*" />
                    </Button>
                    <br />
                    <br />
                    <Button type="submit" variant="contained" color="primary">   Update </Button>
                    <NavLink to="/company/display">
                        <Button variant="contained">Back &nbsp; <ArrowBack /> </Button>
                    </NavLink>
                </form>
            }
        </div>
    );
}

export default UpdateCouponForm;
