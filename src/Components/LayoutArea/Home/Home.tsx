import { Typography } from "@material-ui/core";
import { Bathtub, BlurOn, CardTravel, Commute, Fastfood, Kitchen, Power, Send } from "@material-ui/icons";
import { Component } from "react";
import { NavLink } from "react-router-dom";
import { Category } from "../../../Models/CouponModel";
import CategoryCard from "../../CouponsArea/CategoryCard/CategoryCard";
import "./Home.css";

/**
 *  Displays category cards representing all available coupon categories.
 */
class Home extends Component {

   public render(): JSX.Element {
      return (
            <div className="Home ScrollerDowner">
            <NavLink to={"/coupons/category/" + Category.ELECTRICITY}>
                <CategoryCard category={Category.ELECTRICITY}>
                 <Power/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.FOOD}>
                <CategoryCard category={Category.FOOD}>
                   <Kitchen/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.HYGIENE_PRODUCTS}>
                <CategoryCard category={Category.HYGIENE_PRODUCTS}>
                   <Bathtub/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.MAGIC}>
                <CategoryCard category={Category.MAGIC}>
                   <BlurOn/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.RESTAURANT}>
                <CategoryCard category={Category.RESTAURANT}>
                   <Fastfood/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.TRANSPORT}>
                <CategoryCard category={Category.TRANSPORT}>
                   <Commute/>
                </CategoryCard>
            </NavLink>
            <NavLink to={"/coupons/category/" + Category.VACATION}>
                <CategoryCard category={Category.VACATION}>
                   <CardTravel/>
                </CategoryCard>
            </NavLink>
            </div >
        );
   }
}

export default Home;
