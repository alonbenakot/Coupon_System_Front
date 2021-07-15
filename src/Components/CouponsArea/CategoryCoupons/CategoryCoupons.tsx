import { Button, Typography } from "@material-ui/core";
import { Home } from "@material-ui/icons";
import axios from "axios";
import { Component } from "react";
import { RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { couponAddedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import CouponCard from "../CouponCard/CouponCard";
import "./CategoryCoupons.css";

interface CategoryCouponsState {
    coupons: CouponModel[];

}


// The parameter passed by from the parent component via routing.
interface RouteParams {
    category: string;
}

interface CategoryCouponsProps extends RouteComponentProps<RouteParams> { }



    /**
     * Displays all coupons from a given category.
     */
class CategoryCoupons extends Component<CategoryCouponsProps, CategoryCouponsState> {

    public async componentDidMount() {
        try {
            let category = this.props.match.params.category.toString();
            let response = await axios.get<CouponModel[]>(globals.urls.categoryCoupons + category);
            response.data.forEach((coup)=> (
                store.dispatch(couponAddedAction(coup))
            ))
            this.setState({ coupons: response.data });
        } catch (error) {
            console.log(error.message);

        }
    }

    public constructor(props: CategoryCouponsProps) {
        super(props);
        this.state = { coupons: null };
    }
    /**
     * Manipulates a string, making each word begin with a capital letter followed by lower case letters.
     * @returns string
     */
    public render(): JSX.Element {
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
        return (
            <div className="CategoryCoupons ScrollerDowner">
                <Typography variant="h4">  {niceString(this.props.match.params.category.toString())} </Typography>
                <br /><br />
                {/* { only display coupons that have an amount greater than zero} */}
                {this.state.coupons?.filter(c => c.amount > 0).map(c => <CouponCard key={c.id} coupon={c}/>)}
                <br />
                <br />
                <NavLink to="/home">
                    <Button startIcon={<Home />} style={{ textTransform: "none" }} variant="contained" color="primary">Home</Button>
                </NavLink>


            </div>
        );
    }
}

export default CategoryCoupons;
