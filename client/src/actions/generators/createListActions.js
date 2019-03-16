import axios from "axios";

export default stateContainer => {
    function getContainerState(getState) {
        return getState()[stateContainer];
    }

    class listActions {
        updateList = () => (dispatch, getState) => {
            const { path, componentName } = getContainerState(getState);

            dispatch(this.setListLoading());

            axios
                .get(`/api/${path}`)
                .then(res => {
                    console.log(res);
                    dispatch({
                        type: `GET_${componentName}_ITEMS`,
                        payload: res.data
                    });
                })
                .catch(err => {});
        };

        loadListPage = () => (dispatch, getState) => {
            const {
                response,
                path,
                componentName,
                loading
            } = getContainerState(getState);
            let { page, pages } = response;

            if (loading) {
                return;
            }

            try {
                page = parseInt(page);
                pages = parseInt(pages);
            } catch (e) {
                console.log(e);
                return;
            }

            if (!pages || page >= pages) {
                return;
            }

            const newPage = page + 1;

            dispatch(this.setListLoading());

            axios
                .get(`/api/${path}`, {
                    params: {
                        page: newPage
                    }
                })
                .then(res => {
                    console.log(res);
                    dispatch({
                        type: `GET_${componentName}_ITEMS`,
                        payload: res.data
                    });
                })
                .catch(err => {});
        };

        setActivePath = path => (dispatch, getState) => {
            const { componentName } = getContainerState(getState);
            dispatch({
                type: `SET_${componentName}_PATH`,
                payload: path
            });
        };

        setListLoading = () => (dispatch, getState) => {
            const { path, id, componentName } = getContainerState(getState);
            dispatch({
                type: `${componentName}_LOADING`
            });
        };

        resetList = () => (dispatch, getState) => {
            const { path, id, componentName } = getContainerState(getState);
            dispatch({
                type: `RESET_${componentName}`
            });
        };
    }

    return new listActions();
};
