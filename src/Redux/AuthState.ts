import UserModel from "../Models/UserModel";

export class AuthState {
    public user: UserModel = null;
    public constructor() {
        let storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            this.user = storedUser;
        }
    }
}

export enum AuthActionType {
    Login = "Login",
    Logout = "Logout"
}

export interface AuthAction {
    type: AuthActionType;
    payload?: any;
}

export function loginAction(user: UserModel): AuthAction {
    return {type: AuthActionType.Login, payload: user};
}
export function logoutAction(): AuthAction {
    return {type: AuthActionType.Logout};
}

export function authReducer(currentState: AuthState = new AuthState(), action: AuthAction) : AuthState {
    const newState = {...currentState};

    switch (action.type) {
        case AuthActionType.Login:
            newState.user = action.payload;
            localStorage.setItem("user", JSON.stringify(newState.user));
            break;
        case AuthActionType.Logout:
            newState.user = null;
            localStorage.removeItem("user");
            break;
    }
    return newState;
}