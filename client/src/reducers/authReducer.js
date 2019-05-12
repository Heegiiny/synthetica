import isEmpty from "../validation/is-empty";

import { SET_CURRENT_USER } from "../actions/types";

const initialState = {
    isAuthenticated: false,
    user: {},
    form: {},
    errors: {}
};

export default function(state = initialState, action) {
    switch (action.type) {
        case `UPDATE_AUTH_FORM`:
            return {
                ...state
            };
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        default:
            return state;
    }
}
