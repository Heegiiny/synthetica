import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";

import createModelActions from "../../actions/generators/createModelActions";

export default (WrappedComponent, stateContainer = "modelPage") => {
    const mapStateToProps = state => ({ ...state[stateContainer] });
    const mapDispatchToProps = createModelActions(stateContainer);

    class ConnectedPage extends Component {
        constructor(props) {
            super(props);

            // Выбираем путь из роутера
            this.path = props.match.path.split("/")[1];

            // Выбираем id активного документа из роутера
            this.activeId = parseInt(props.match.params.id);

            this.props.resetPage();
            this.props.setActivePath(this.path, this.activeId);

            // Загружаем надписи
            //this.captions = captions[this.path].sidebar;
        }

        componentDidMount() {
            this.props.updatePage();
        }

        componentWillUnmount() {
            // this.props.resetPage();
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    }

    return compose(
        withRouter,
        connect(
            mapStateToProps,
            mapDispatchToProps
        )
    )(ConnectedPage);
};
