import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withRouter } from "react-router";
import { Button } from "reactstrap";

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
            // Загружаем надписи
            //this.captions = captions[this.path].sidebar;
            this.updateState = handleChangeHelper(this.props.updateStateModel);
            this.handleSubmit = this.handleSubmit.bind(this);
        }

        handleSubmit(event) {
            event.preventDefault();
            this.props.savePage(doc => {
                this.props.history.push(`/${this.path}/${doc.id}`);
            });
        }

        componentDidMount() {
            this.props.updatePage();
        }

        componentWillUnmount() {
            //this.props.resetPage();
        }

        render() {
            const { errors, model } = this.props;
            return (
                <FormContainer onSubmit={this.handleSubmit}>
                    <WrappedComponent
                        {...this.props}
                        onInputChange={this.updateState.onChange}
                        updateStateModel={this.updateState.update}
                        model={model}
                        errors={errors}
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
