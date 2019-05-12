import axios from "axios";
import store from "../../store";

export default stateContainer => {
    function getContainerState() {
        return store.getState()[stateContainer];
    }

    class modelActions {
        updatePage = () => dispatch => {
            const { path, id, componentName } = getContainerState();

            if (!id) {
                return this.resetPage();
            }

            dispatch(this.setPageLoading());

            axios
                .get(`/api/${path}/${id}`)
                .then(res => {
                    console.log(res);

                    dispatch({
                        type: `GET_${componentName}_MODEL`,
                        payload: res.data
                    });
                })
                .catch(err => {
                    console.log(err);

                    dispatch({
                        type: `SET_${componentName}_ERRORS`,
                        payload: err.response
                    });
                });
        };

        savePage = callback => dispatch => {
            let { path, id, componentName, model } = getContainerState();

            if (!id) {
                id = "";
            }

            axios
                .post(`/api/${path}/${id}`, model)
                .then(res => {
                    console.log(res);

                    callback(res.data);
                })
                .catch(err => {
                    console.log(err);

                    dispatch({
                        type: `SET_${componentName}_ERRORS`,
                        payload: err.response
                    });
                });
        };

        deletePage = callback => dispatch => {
            let { path, id, componentName } = getContainerState();

            if (!id) {
                console.log("No id in deletePage()");

                return;
            }

            axios
                .delete(`/api/${path}/${id}`)
                .then(res => {
                    console.log(res);

                    callback();
                })
                .catch(err => {
                    console.log(err);

                    dispatch({
                        type: `SET_${componentName}_ERRORS`,
                        payload: err.response
                    });
                });
        };

        updateStateModel = (path, value) => {
            const { componentName } = getContainerState();

            return {
                type: `UPDATE_${componentName}_MODEL`,
                payload: {
                    path: path,
                    value: value
                }
            };
        };

        setActivePath = (path, id) => {
            const { componentName } = getContainerState();
            return {
                type: `SET_${componentName}_PATH`,
                payload: {
                    path: path,
                    id: id
                }
            };
        };

        setPageLoading = () => {
            const { componentName } = getContainerState();
            return {
                type: `${componentName}_LOADING`
            };
        };

        resetPage = () => {
            const { componentName } = getContainerState();
            return {
                type: `RESET_${componentName}`
            };
        };
    }

    return new modelActions();
};
