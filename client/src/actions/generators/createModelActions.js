import axios from "axios";

export default stateContainer => {
    function getContainerState(getState) {
        return getState()[stateContainer];
    }

    class modelActions {
        updatePage = () => (dispatch, getState) => {
            const { path, id, componentName } = getContainerState(getState);

            if (!id) {
                return;
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
                .catch(err => {});
        };

        updateStateModel = (path, value) => (dispatch, getState) => {
            const { componentName } = getContainerState(getState);

            dispatch({
                type: `UPDATE_${componentName}_MODEL`,
                payload: {
                    path: path,
                    value: value
                }
            });
        };

        savePage = (model, history) => (dispatch, getState) => {
            //dispatch(setPageLoading());

            let { path, id, componentName } = getContainerState(getState);

            if (!id) {
                id = "";
            }

            axios
                .post(`/api/${path}/${id}`, model)
                .then(res => {
                    history.push(`/${path}/${res.data.id}`);
                })
                .catch(err => {});
        };

        setActivePath = (path, id) => (dispatch, getState) => {
            const { componentName } = getContainerState(getState);
            dispatch({
                type: `SET_${componentName}_PATH`,
                payload: {
                    path: path,
                    id: id
                }
            });
        };

        setPageLoading = () => (dispatch, getState) => {
            const { path, id, componentName } = getContainerState(getState);
            dispatch({
                type: `${componentName}_LOADING`
            });
        };

        resetPage = () => (dispatch, getState) => {
            const { path, id, componentName } = getContainerState(getState);
            dispatch({
                type: `RESET_${componentName}`
            });
        };
    }

    return new modelActions();
};
