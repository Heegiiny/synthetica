import objectPath from "object-path";

export default function(componentName) {
    const initialState = {
        path: "",
        loading: false,
        query: [],
        items: [],
        response: {},
        componentName: componentName
    };

    return function(state = initialState, action) {
        switch (action.type) {
            case `SET_${componentName}_PATH`:
                if (action.payload === state.path) {
                    return state;
                }
                return {
                    ...initialState,
                    path: action.payload
                };

            case `${componentName}_LOADING`:
                return {
                    ...state,
                    loading: true
                };

            case `GET_${componentName}_ITEMS`:
                const { docs, ...response } = action.payload;

                return {
                    ...state,
                    items: [...state.items, ...docs],
                    loading: false,
                    response: response
                };

            case `SET_${componentName}_QUERY`:
                return {
                    ...initialState,
                    query: action.payload,
                    path: state.path
                };

            case `RESET_${componentName}`:
                return initialState;

            default:
                return state;
        }
    };
}
