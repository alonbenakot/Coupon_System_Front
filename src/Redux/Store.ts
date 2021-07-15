import { combineReducers, createStore } from 'redux';
import { authReducer } from './AuthState';
import { companiesReducer } from './CompanyState';
import { couponsReducer } from './CouponsState';
import { customersReducer } from './CustomersState';

let reducers = combineReducers({couponState: couponsReducer, authState: authReducer, companyState: companiesReducer, customerState: customersReducer});
let store = createStore(reducers);

export default store;