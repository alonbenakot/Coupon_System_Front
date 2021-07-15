import { Button, FormControl, FormHelperText, Input, TextField, InputLabel, makeStyles, MenuItem, Select, Typography } from "@material-ui/core";
import { Add, ArrowBack } from "@material-ui/icons";
import { kMaxLength } from "buffer";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel, { Category } from "../../../../Models/CouponModel";
import { ClientType } from "../../../../Models/UserModel";
import { couponAddedAction } from "../../../../Redux/CouponsState";
import store from "../../../../Redux/Store";
import globals from "../../../../Services/Globals";
import jwtAxios from "../../../../Services/jwtAxios";
import notify from "../../../../Services/Notifications";
import "./AddCoupon.css";

const useStyles = makeStyles((theme) => ({
    form: {
        margin: theme.spacing(1),
        minWidth: 200
    }
}))


/**
 * /**
 * Displays a form which allows the company to add a coupon. 
 */
function AddCoupon(): JSX.Element {
    let { handleSubmit, register } = useForm<CouponModel>();
    const [value, setValue] = useState('');
    let history = useHistory();
    const classes = useStyles();

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setValue(event.target.value as Category);
    };

    useEffect(() => {
        if (store.getState().authState.user?.clientType !== ClientType.COMPANY) {
            notify.error("Please log in");
            history.push("/login/company")
        }
    })

    /**
     * Receives the coupon data from the form. The function then sends the coupon
     *  as FormData to the server.
     * @param coupon 
     */
    async function send(coupon: CouponModel) {
        try {
            const myFormData = new FormData();

            myFormData.append("amount", coupon.amount.toString());
            myFormData.append("category", coupon.category.toString());
            myFormData.append("description", coupon.description);
            myFormData.append("endDate", new Date(coupon.endDate).toISOString().split("T")[0]);
            myFormData.append("price", coupon.price.toString());
            myFormData.append("startDate", new Date(coupon.startDate).toISOString().split("T")[0]);
            myFormData.append("title", coupon.title);
            myFormData.append("image", coupon.image.item(0));

            myFormData.forEach((e) => console.log(e));

            let response = await jwtAxios.post<CouponModel>(globals.urls.addCoupon, myFormData);
            let addedCoupon = response.data;
            
            store.dispatch(couponAddedAction(addedCoupon));
            notify.success("Coupon " + coupon.title + "  added.");
            // in order to give the picture time to be downloaded
            setTimeout(() => {
                history.push("/company/display");
            }, 1500);
        } catch (error) {
            notify.error(error);
        }
    }
    return (
        <div className="AddCoupon">
            <form title="Add a Customer" encType="multipart/form-data"
                onSubmit={handleSubmit(send)} >
                <Typography variant="h6">Add a Coupon</Typography>
                <FormControl>
                    <InputLabel>Coupon Title</InputLabel>
                    <Input required id="title" {...register("title")} inputProps={{ maxLength: 20 }} />
                </FormControl>
                <br />
                <FormControl className={classes.form}>
                    <InputLabel>Coupon Category</InputLabel>
                    <Select
                        {...register("category")}
                        labelId="labelIdCategories"
                        id="categoriesId"
                        value={value}
                        required
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
                    <Input id="description" required {...register("description")} />
                </FormControl>
                <br />
                <FormControl className={classes.form}>
                    <InputLabel shrink>Coupon Start Date</InputLabel>
                    <Input id="startDate" type="date" required fullWidth {...register("startDate")} />
                </FormControl>
                <br />
                <FormControl className={classes.form}>
                    <InputLabel shrink >Coupon End Date</InputLabel>
                    <Input id="endDate" type="date" required fullWidth {...register("endDate")} />
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel >Coupon Amount</InputLabel>
                    <Input id="amount" type="number" inputProps={{min: 1}} required {...register("amount")} />
                </FormControl>
                <br />
                <FormControl>
                    <InputLabel >Coupon Price</InputLabel>
                    <Input id="price" type="number" inputProps={{min: 0, step: "0.01"}} required  {...register("price")} />
                </FormControl>
                <br />
                <FormControl>
                    <br />
                    <Button
                        variant="contained"
                        component="label">
                        Upload Image
                        <input hidden type="file" name="image" {...register('image')} accept="image/*" />
                    </Button>

                </FormControl>
                <br />
                <br />
                <Button type="submit" variant="contained" color="primary">   Add &nbsp;<Add /> </Button>
                <NavLink to="/company/display">
                    <Button variant="contained">Back &nbsp; <ArrowBack /> </Button>
                </NavLink>
            </form>
        </div >
    );
}

export default AddCoupon;
