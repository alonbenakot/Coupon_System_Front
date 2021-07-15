// import { CouponAction, CouponsActionType } from './CouponsState';
import CouponModel from "../Models/CouponModel";

export class CouponsState {
    public coupons: CouponModel[] = [];
}

export enum CouponsActionType {
    CouponAdded = "CouponAdded",
    CouponUpdated = "CouponUpdated",
    CouponDeleted = "CouponDeleted",
    CouponDownloaded = "CouponDownloaded"
}

export interface CouponAction {
    type: CouponsActionType;
    payload: any;
}

export function couponsDowloadedAction(coupons: CouponModel[]): CouponAction {
    return { type: CouponsActionType.CouponDownloaded, payload: coupons }
}

export function couponUpdatedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponUpdated, payload: coupon }
}

export function couponDeletedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponDeleted, payload: coupon }
}

export function couponAddedAction(coupon: CouponModel): CouponAction {
    return { type: CouponsActionType.CouponAdded, payload: coupon }
}

export function couponsReducer(currentState: CouponsState = new CouponsState(), action: CouponAction): CouponsState {
    let newState = { ...currentState };
    let index;

    switch (action.type) {
        case CouponsActionType.CouponDownloaded:
            newState.coupons = action.payload;
            break;
        case CouponsActionType.CouponAdded:
            // only add to the state if the coupon isn't already there
            if (!newState.coupons.includes(action.payload)) {
                newState.coupons.push(action.payload);
            }
            break;
        case CouponsActionType.CouponDeleted:
            index = newState.coupons.findIndex(element => element.id === action.payload.id);
            newState.coupons.splice(index, 1);
            break;
        case CouponsActionType.CouponUpdated:
            index = newState.coupons.findIndex(element => element.id === action.payload.id);
            newState.coupons[index] = action.payload;
            break;
    }
    return newState;
}