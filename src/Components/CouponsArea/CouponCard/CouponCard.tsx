import { Button, ButtonGroup, Card, CardActions, CardMedia, CardContent, CardHeader, createStyles, IconButton, makeStyles, Theme, Typography } from "@material-ui/core";
import { ControlPoint } from "@material-ui/icons";
import { ReactNode } from "react";
import { useHistory, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import CouponModel from "../../../Models/CouponModel";
import { ClientType } from "../../../Models/UserModel";
import { couponDeletedAction } from "../../../Redux/CouponsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/jwtAxios";
import notify from "../../../Services/Notifications";
import "./CouponCard.css";

const useStyles = makeStyles((theme: Theme) =>
createStyles({
  cardStyle: {
    width: 300
  },
    media: {
      height: 0,
      paddingTop: '56.25%',
    },
    title: {
      maxWidth: 270,
      fontSize: 14,
      marginBottom: 0,
      paddingBottom: 0
    },
    description: {
      marginTop: 0,
      paddingTop: 0,
      
    },
    content: {
      textAlign: "left"
    },
    buttons: {
      justifyContent: "center"

    }
  }));
  
  interface CouponCardProps {
    coupon: CouponModel;
    handleD?: Function;
    handleU?: Function;
  
  }

function CouponCard(props: CouponCardProps): JSX.Element {
  let classes = useStyles();
  let location = useLocation();
  let user = store.getState().authState.user;

  /**
   * Converts a date to dd/MM/yy format.
   * @param dateMilli 
   * @returns 
   */
  function taskDate(dateMilli: string | number | Date) {
    var d = (new Date(dateMilli) + '').split(' ');
    d[2] = d[2] + ',';

    return [d[1], d[2], d[3]].join(' ');
  }
  
  /**
   * Only show the coupon if there is more than one (amount >0), it is the logged in company's coupon, or the admin is the user .
   * @returns boolean
   */
  const showCoupon = (): boolean => {
    let show = false;
    if (props.coupon.amount > 0) {
      show = true;
    }
    else if (user?.clientType === ClientType.COMPANY && user?.id === props.coupon.company.id) {
      show = true;
    }
    else if (user?.clientType === ClientType.ADMINISTRATOR) {
      show = true;
    }
    else if (user?.clientType === ClientType.CUSTOMER) {
      let cust = store.getState().customerState.customers.find(c => c.id === user.id);
      if (cust !== undefined) {
        let custCoupon = cust.coupons.find(c => c.id === props.coupon.id);
        if (custCoupon !== undefined)
          show = true;
        }
      }
      return show;
  }


  return (
    <div className="CouponCard" >
      {showCoupon() &&
        <Card key={props.coupon.id} className={classes.cardStyle}>
          <NavLink key={props.coupon.id} to={"/coupons/full-details/" + props.coupon.id.toString()} >

            {props.coupon.imageName !== "no_image" &&
              <CardMedia
                className={classes.media}
                image={globals.urls.images +
                  props.coupon.imageName}
              />
            }
            <CardHeader className={classes.title} title={props.coupon.title} />
            <CardContent className={classes.content} >
              <Typography className={classes.description} variant="body2" color="textSecondary">
                {props.coupon.description}
              </Typography>
              Company: {props.coupon?.company.name}
              <br />
              End Date: &nbsp; {taskDate(props.coupon.endDate)}
              <Typography variant="body1">
                Price:  ${props.coupon.price}
              </Typography>
            </CardContent>
          </NavLink>
          {/* show delete and update buttons only in the company display are */}
          {location.pathname === "/company/display" &&
            <CardActions className={classes.buttons}>
              <Button
                onClick={() => props.handleD(props.coupon)}
                variant="contained" color="primary"> Delete </Button>
              <Button onClick={() => props.handleU(props.coupon.id)}
                variant="contained"> Update </Button>
            </CardActions>
          }
        </Card>
      }
    </div>
  );
}


export default CouponCard;
