import axios from "axios";

export const getSuggestionsByField = fieldName => (dispatch, getState) => {
    const filterFields = field => field.fieldName === fieldName;
    return getState().suggestions.fields.filter(filterFields)[0].items;
};

export const getQueryByField = fieldName => (dispatch, getState) => {
    const filterFields = field => field.fieldName === fieldName;
    return getState().suggestions.fields.filter(filterFields)[0].query;
};

export const updateSuggestions = fieldName => (dispatch, getState) => {
    dispatch(setSuggestionsLoading(fieldName));

    const filterFields = field => field.fieldName === fieldName;
    const { path, query } = getState().suggestions.fields.filter(
        filterFields
    )[0];

    axios
        .get(`/api/${path}`, {
            params: {
                title: query
            }
        })
        .then(res => {
            console.log(res);
            dispatch({
                type: `GET_SUGGESTIONS`,
                payload: {
                    fieldName: fieldName,
                    items: res.data.docs
                }
            });
        })
        .catch(err => console.log(err));
};

export const setSuggestionsQuery = (fieldName, query) => dispatch => {
    dispatch({
        type: `SET_SUGGESTIONS_QUERY`,
        payload: {
            fieldName: fieldName,
            query: query
        }
    });
    dispatch(updateSuggestions(fieldName));
};

export const initSuggestionsField = (fieldName, path) => ({
    type: `INIT_SUGGESTIONS_FIELD`,
    payload: {
        fieldName: fieldName,
        path: path
    }
});

export const setSuggestionsLoading = fieldName => ({
    type: `SET_SUGGESTIONS_LOADING`,
    payload: fieldName
});
