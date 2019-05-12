import React, { Component } from "react";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";
import classNames from "classnames";
import idGenerator from "react-id-generator";
import ImageField from "../forms/ImageField";

class CompoundFormulaField extends Component {
    constructor(props) {
        super(props);

        this.inputIds = {
            formulaImageTrue: idGenerator("formulaImageTrue"),
            formulaImageFalse: idGenerator("formulaImageFalse"),
            formulaText: idGenerator("formulaText")
        };

        this.initialFormula = {
            isImage: false,
            text: ""
        };

        this.state = {
            formula: props.formula ? props.formula : this.initialFormula,
            error: props.errors ? props.errors.text : null
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            formula: props.formula ? props.formula : this.initialFormula,
            error: props.errors ? props.errors.text : null
        });
    }

    renderField = () => {
        const { formula, error } = this.state;
        if (formula.isImage) {
            return (
                <ImageField
                    value={formula.text}
                    onNewImage={media_id =>
                        this.props.updateStateModel("text", media_id)
                    }
                />
            );
        } else {
            return (
                <Input
                    type="text"
                    name="text"
                    id={this.inputIds.formulaText}
                    value={formula.text}
                    invalid={!!error}
                    onChange={this.props.onInputChange}
                />
            );
        }
    };

    onRadioChange = e => {
        this.props.updateStateModel("text", "");
        this.props.onInputChange(e);
    };

    renderRadioRow = () => {
        const { formula } = this.state;
        return (
            <div className="formula-field-radio-row">
                <div className="col-6">
                    <Label check>
                        <Input
                            type="radio"
                            name="isImage"
                            value={false}
                            checked={!formula.isImage}
                            onChange={this.onRadioChange}
                        />
                        Text formula
                    </Label>
                </div>
                <div className="col-6">
                    <Label check>
                        <Input
                            type="radio"
                            name="isImage"
                            value={true}
                            checked={formula.isImage}
                            onChange={this.onRadioChange}
                        />
                        Graphical formula
                    </Label>
                </div>
            </div>
        );
    };

    getFieldClassName = () =>
        classNames("formula-field compound-formula-field", {
            "is-invalid": this.state.error
        });

    render() {
        const { error } = this.state;
        return (
            <FormGroup>
                <Label for={this.inputIds.formulaText}>Formula</Label>

                <div className={this.getFieldClassName()}>
                    {this.renderRadioRow()}
                    {this.renderField()}
                </div>
                {error && <FormFeedback>{error}</FormFeedback>}
            </FormGroup>
        );
    }
}

export default CompoundFormulaField;
