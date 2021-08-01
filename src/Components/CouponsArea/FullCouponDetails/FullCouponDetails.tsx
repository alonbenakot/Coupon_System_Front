import { Button, Card, CardActions, CardContent, CardMedia, CardHeader, createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import CouponModel from "../../../Models/CouponModel";
import { ClientType } from "../../../Models/UserModel";
import { couponUpdatedAction } from "../../../Redux/CouponsState";
import { customerUpdatedAction } from "../../../Redux/CustomersState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notifications";
import "./FullCouponDetails.css";



const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cardStyle: {
            minWidth: 350,
        },
        media: {
            height: 0,
            paddingTop: '56.25%',
        },
        title: {
            fontSize: 14,
            marginBottom: 0,
            paddingBottom: 0
        },
        description: {
            marginTop: 0,
            paddingTop: 0,

        },
        content: {
            textAlign: "left",
        },
        buttons: {
            justifyContent: "center"
        }
    }));


interface RouteParams {
    id: string;
}

interface FullCouponDetailsProps extends RouteComponentProps<RouteParams> {
}

function FullCouponDetails(props: FullCouponDetailsProps): JSX.Element {
    let classes = useStyles();
    let user = store.getState().authState?.user;
    const history = useHistory();
    console.log(+props.match.params.id);

    let [coupon, setCoupon] = useState<CouponModel>(store.getState().couponState.coupons.find((c) => (
        c.id === +props.match.params.id)));

    /**
     * Converts a date to dd/MM/yy format.
     * @param dateMilli 
     */
    function taskDate(dateMilli: string | number | Date) {
        var d = (new Date(dateMilli) + '').split(' ');
        d[2] = d[2] + ',';

        return [d[1], d[2], d[3]].join(' ');
    }

    /**
     * If the user is a customer, passes on the selected coupon to the server in order to make a purchase. 
     */
    const purchaseCoupon = async () => {
        if (store.getState().authState.user?.clientType === ClientType.CUSTOMER) {
            try {
                let response = await jwtAxios.put<CouponModel>(globals.urls.purchaseCoupon, coupon);
                let customer = store.getState().customerState.customers.find((c) => c.id === user.id);
                customer.coupons.push(response.data);
                store.dispatch(customerUpdatedAction(customer));
                store.dispatch(couponUpdatedAction(response.data));
                notify.success("Coupon " + coupon.title + " purchased. Keep on shopping!");
                history.push("/home");
            } catch (error) {
                notify.error(error);
            }
        } else {
            notify.error("Please log in to continue purchase")
            history.push("/login/customer");
        }
    }
    /**
     * Gives the user a vague amount of the selected coupon and returns it as a string.
     * @returns string
     */
    const showAmount = (): string => {
        let answer = "No coupons left!";
        if (store.getState().authState.user?.id === coupon.company.id) {answer = coupon.amount.toString();}
        else if (coupon.amount === 1) { answer = "Last on left!" }
        else if (coupon.amount < 10 && coupon.amount > 0) { answer = "Under 10 left!" }
        else if (coupon.amount < 50 && coupon.amount > 9) { answer = "Under 50 left!" }
        else if (coupon.amount < 100 && coupon.amount > 49) { answer = "Under 100" }
        else if (coupon.amount > 100) { answer = "Over 100" }
        else if (coupon.amount > 200) { answer = "Over 200" }
        else if (coupon.amount > 500) { answer = "Over 500" }
        else if (coupon.amount > 1000) { answer = "Over 1000" }
        return answer;
    }
    /**
     *  Manipulates a string, making each word begin with a capital letter followed by lower case letters.
     * @param categoryName 
     * @returns string
     */
    function niceString(categoryName: string): string {
        categoryName = categoryName.toLowerCase();
        categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        categoryName = categoryName.replace('_', ' ')
        let words = categoryName.split(' ');
        for (let i = 0; i < words.length; i++) {
            words[i] = words[i][0].toUpperCase() + words[i].substr(1);
        }
        return words.join(" ");

    }

    /**
     * Decides whether to show the Purchase Button to the user.
     * Will return true only if the user is a guest or a customer that has not purchased this coupon before. 
     * @returns boolean
     */
    const toShowOrNotToShow = (): boolean => {
        let show: boolean = true;
        if (user?.clientType === ClientType.ADMINISTRATOR) {
            show = false;
        }
        if (user?.clientType === ClientType.COMPANY) {
            show = false;
        }
        // check if current customer has this coupon already
        let currentUser = store.getState().customerState.customers.find(c => c.id === user?.id)
        let purchasedCoupon = currentUser?.coupons.find((c) => c.id === +props.match.params.id)
        if (purchasedCoupon) {
            show = false
        }
        return show;
    }

    /**
     * Insures a refresh does not crash the site by using the local storage.
     */
    useEffect(() => {
        //  downloads from local storage
        if (coupon === undefined) {
            let storageCoupon = localStorage.getItem("storage-coupon");
            if (storageCoupon !== 'undefined' && storageCoupon !== 'null') {
                setCoupon(JSON.parse(storageCoupon));
            }
        } else {
            // sends to local storage
            localStorage.setItem("storage-coupon", JSON.stringify(coupon));
        }
    })
    return (
        <div className="FullCouponDetails">
            {console.log(props.match.params.id)}

            {coupon &&
                <Card key={coupon.id} className={classes.cardStyle}>
                    {coupon.imageName !== "no_image" &&
                        <CardMedia
                            className={classes.media}
                            image={coupon.imageName}
                        />
                    }
                    <CardHeader className={classes.title} title={coupon.title} subheader={niceString(coupon.category)} />
                    <CardContent className={classes.content} >
                        <Typography className={classes.description} variant="body2" color="textSecondary">
                            {coupon.description}
                        </Typography>
                        <br />
                        Company: {coupon?.company.name}
                        <br />
                        <br />
                        Start Date: &nbsp; {taskDate(coupon.startDate)}
                        <br />
                        <br />
                        End Date: &nbsp; {taskDate(coupon.endDate)}
                        <br />
                        <br />
                        {/* Show the amount only it is larger than 0 or the coupon belongs to the company */}
                        {(coupon.amount > 0 || user?.clientType === ClientType.COMPANY) && <>
                            Amount: &nbsp; {showAmount()}
                            <br />
                            <br />
                        </>
                        }
                        <Typography variant="body1">
                            Price:  ${coupon.price}
                        </Typography>
                    </CardContent>
                    <CardActions className={classes.buttons}>
                        {
                            toShowOrNotToShow() &&
                            <Button
                                onClick={() => purchaseCoupon()}
                                variant="contained" color="primary"> Buy </Button>
                        }
                        <Button startIcon={< ArrowBackIcon />} style={{ textTransform: "none" }} onClick={history.goBack} >Back</Button>
                    </CardActions>

                </Card>
            }
        </div>
    );
}

export default FullCouponDetails;
