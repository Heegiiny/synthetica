import { combineReducers } from "redux";
import authReducer from "./authReducer";
import suggestionsReducer from "./suggestionsReducer";
import createModelReducer from "./hor/createModelReducer";
import createListReducer from "./hor/createListReducer";

export default combineReducers({
    auth: authReducer,
    suggestions: suggestionsReducer,
    listPage: createListReducer("LIST_PAGE"),
    dashboardCompounds: createListReducer("DASHBOARD_COMPOUNDS"),
    dashboardSyntheses: createListReducer("DASHBOARD_SYNTHESES"),
    galleryList: createListReducer("GALLERY_LIST"),
    modelPage: createModelReducer("MODEL_PAGE"),
    galleryPost: createModelReducer("GALLERY_POST")
});
