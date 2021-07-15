import CustomerModel from "../Models/CustomerModel";

export class CustomersState {
    public customers: CustomerModel[] = [];
}

export enum CustomersActionType{
    CustomerAdded = "CustomerAdded",
    CustomerUpdated = "CustomerUpdated",
    CustomerDeleted = "CustomerDeleted",
    CustomersDownloaded = "CustomersDownloaded"
}

export interface CustomerAction {
    type: CustomersActionType;
    payload: any;
}

export function customersDownloadedAction(customers: CustomerModel[]): CustomerAction {
    return { type: CustomersActionType.CustomersDownloaded, payload: customers }
}
export function customerUpdatedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomersActionType.CustomerUpdated, payload: customer }
}
export function customerDeletedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomersActionType.CustomerDeleted, payload: customer }
}
export function customerAddedAction(customer: CustomerModel): CustomerAction {
    return { type: CustomersActionType.CustomerAdded, payload: customer }
}

export function customersReducer(currentState: CustomersState = new CustomersState(), action: CustomerAction): CustomersState {
    let newState = {...currentState};
    let index;

    switch (action.type) {
        case CustomersActionType.CustomersDownloaded:
            newState.customers = action.payload;
            break;
        case CustomersActionType.CustomerAdded:
            newState.customers.push(action.payload);
            break;
        case CustomersActionType.CustomerDeleted:
            index = newState.customers.findIndex(element => element.id === action.payload.id);
            newState.customers.splice(index, 1);
            break;
        case CustomersActionType.CustomerUpdated:
            index = newState.customers.findIndex(element => element.id === action.payload.id);
            newState.customers[index] = action.payload;
            break;
    }
    return newState;
}