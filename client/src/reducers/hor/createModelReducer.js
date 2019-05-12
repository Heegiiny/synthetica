import objectPath from "object-path";

function unsetFieldError(errors, path) {
    const clonedErrors = JSON.parse(JSON.stringify(errors));
    objectPath.del(clonedErrors, "data.errors." + path);
    return clonedErrors;
}

export default function(componentName) {
    const initialState = {
        path: "",
        id: 0,
        loading: false,
        model: {},
        errors: {},
        componentName: componentName
    };

    return function(state = initialState, action) {
        switch (action.type) {
            case `SET_${componentName}_ERRORS`:
                return {
                    ...state,
                    errors: action.payload
                };

            case `RESET_${componentName}_ERRORS`:
                return {
                    ...state,
                    errors: action.payload
                        ? unsetFieldError(state.errors, action.payload)
                        : {}
                };

            case `SET_${componentName}_PATH`:
                if (
                    action.payload.path === state.path &&
                    action.payload.id === state.id
                ) {
                    return state;
                }
                return {
                    ...initialState,
                    //activeModel: action.payload.model,
                    path: action.payload.path,
                    id: action.payload.id
                };

            case `${componentName}_LOADING`:
                return {
                    ...state,
                    loading: true
                };

            case `UPDATE_${componentName}_MODEL`:
                const { path, value } = action.payload;
                const clonedModel = JSON.parse(JSON.stringify(state.model));
                objectPath.set(clonedModel, path, value);
                return {
                    ...state,
                    model: clonedModel,
                    errors: unsetFieldError(state.errors, path)
                };

            case `GET_${componentName}_MODEL`:
                return {
                    ...state,
                    loading: false,
                    model: action.payload
                };

            case `RESET_${componentName}`:
                return initialState;

            default:
                return state;
        }
    };
}
