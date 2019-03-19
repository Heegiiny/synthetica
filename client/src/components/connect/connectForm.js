import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormText,
    FormFeedback,
    Badge
} from "reactstrap";

import FormContainer from "../forms/FormContainer";
import handleChangeHelper from "../../helpers/handleChangeHelper";
import pathHelper from "../../helpers/pathHelper";

import createModelActions from "../../actions/generators/createModelActions";
import * as suggestionsActions from "../../actions/suggestionsActions";

export default (WrappedComponent, stateContainer = "modelPage") => {
    const mapStateToProps = state => ({
        ...state[stateContainer],
        suggestions: state.suggestions.fields
    });
    const mapDispatchToProps = {
        ...createModelActions(stateContainer),
        ...suggestionsActions
    };

    class ConnectedForm extends Component {
        constructor(props) {
            super(props);

            // Выбираем путь из роутера
            this.path = pathHelper(props.match.url);

            // Выбираем id активного документа из роутера
            this.activeId = parseInt(props.match.params.id);

            this.props.resetPage();

            this.props.setActivePath(this.path, this.activeId);

            this.state = {
                model: props.model
            };
            // Загружаем надписи
            //this.captions = captions[this.path].sidebar;
            this.updateState = handleChangeHelper(this.props.updateStateModel);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
            event.preventDefault();
            this.props.savePage(this.state.model, this.props.history);
        }

        componentDidMount() {
            this.props.updatePage();
        }

        componentWillUnmount() {
            //this.props.resetPage();
        }

        componentWillReceiveProps(newProps) {
            const model = newProps.model ? newProps.model : {};

            this.setState({
                model: model
            });
        }

        render() {
            return (
                <FormContainer onSubmit={this.handleSubmit}>
                    <WrappedComponent
                        {...this.props}
                        onInputChange={this.updateState.onChange}
                        updateStateModel={this.updateState.update}
                        model={this.props.model}
                    />
                    <Button outline color="success">
                        Save
                    </Button>
                </FormContainer>
            );
        }
    }

    return compose(
        withRouter,
        connect(
            mapStateToProps,
            mapDispatchToProps
        )
    )(ConnectedForm);
};
