import React, { Component } from "react";
import idGenerator from "react-id-generator";
import { connect } from "react-redux";
import { compose } from "redux";
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
import Autosuggest from "react-autosuggest";
import * as suggestionsActions from "../../actions/suggestionsActions";

const mapStateToProps = state => ({
    suggestions: state.suggestions.fields
});

const mapDispatchToProps = {
    ...suggestionsActions
};

class SuggestionsField extends Component {
    constructor(props) {
        super(props);

        this.props.initSuggestionsField(props.name, props.path);
        this.inputId = idGenerator("SuggestionsField_" + props.name);
    }

    renderSuggestion = suggestion => {
        return <div>{suggestion.title}</div>;
    };

    getSuggestionValue = suggestion => suggestion.title;

    render() {
        const { label, name, path, error, onSuggestionSelected } = this.props;
        return (
            <FormGroup>
                <Label for={this.inputId}>{label}</Label>
                <Autosuggest
                    suggestions={this.props.getSuggestionsByField(name)}
                    onSuggestionsFetchRequested={({ value }) =>
                        this.props.setSuggestionsQuery(name, value)
                    }
                    alwaysRenderSuggestions={true}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    onSuggestionSelected={onSuggestionSelected}
                    inputProps={{
                        className: "form-control",
                        id: this.inputId,
                        value: this.props.getQueryByField(name),
                        onChange: () => {}
                    }}
                />
                {error && <FormFeedback>{error}</FormFeedback>}
            </FormGroup>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SuggestionsField);
