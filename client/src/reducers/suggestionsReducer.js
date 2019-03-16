const initialState = {
    fields: []
};

const initialFieldState = {
    path: "",
    query: "",
    fieldName: "",
    loading: false,
    items: []
};

export default function(state = initialState, action) {
    const isCurrentField = field => {
        if (typeof action.payload === "string") {
            return action.payload === field.fieldName;
        }
        if (typeof action.payload === "object") {
            return action.payload.fieldName === field.fieldName;
        }
    };

    let setItems;

    switch (action.type) {
        case `SET_SUGGESTIONS_QUERY`:
            setItems = field => ({
                ...field,
                query: isCurrentField(field)
                    ? action.payload.query
                    : field.query,
                loading: isCurrentField(field) ? false : field.loading,
                items: isCurrentField(field) ? [] : field.items
            });

            return {
                fields: [...state.fields.map(setItems)]
            };

        case `GET_SUGGESTIONS`:
            setItems = field => ({
                ...field,
                loading: isCurrentField(field) ? false : field.loading,
                items: isCurrentField(field)
                    ? action.payload.items
                    : field.items
            });

            return {
                fields: [...state.fields.map(setItems)]
            };

        case `SET_SUGGESTIONS_LOADING`:
            setItems = field => ({
                ...field,
                loading: isCurrentField(field) ? true : field.loading
            });

            return {
                fields: [...state.fields.map(setItems)]
            };

        case `INIT_SUGGESTIONS_FIELD`:
            return {
                fields: [
                    ...state.fields,
                    {
                        ...initialFieldState,
                        ...action.payload
                    }
                ]
            };

        case `RESET_SUGGESTIONS`:
            return initialState;

        default:
            return state;
    }
}
