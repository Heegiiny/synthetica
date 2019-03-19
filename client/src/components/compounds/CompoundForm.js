import React, { Component, Fragment } from "react";
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
import FormInput from "../forms/FormInput";
import ImageField from "../forms/ImageField";
import GalleryPostForm from "../gallery/GalleryPostForm";
import handleChangeHelper from "../../helpers/handleChangeHelper";
import idGenerator from "react-id-generator";

class CompoundForm extends Component {
    constructor(props) {
        super(props);

        //this.model = props.model;
        this.isNew = !props.model._id;
        if (this.isNew) {
            this.initGalleryForm();
        }

        this.inputIds = {};
    }

    initGalleryForm = () => {
        const newPostPrefix = "gallery.0";

        this.props.updateStateModel(newPostPrefix, {});

        this.updatePostState = handleChangeHelper(
            this.props.updateStateModel,
            newPostPrefix
        );
    };

    renderHeadline = () => {
        if (!this.props.savePage) {
            return null;
        }
        const headerText = !this.props.model._id
            ? "Edit: " + this.props.model.title
            : "New compound";

        return <h1>{headerText}</h1>;
    };

    renderFormulaField = () => {
        const formula = this.props.model.formula
            ? this.props.model.formula
            : {
                  isImage: false,
                  text: ""
              };

        const idsKeys = [
            "formulaImageTrue",
            "formulaImageFalse",
            "formulaText"
        ];

        idsKeys.forEach(key => {
            if (!this.inputIds[key]) {
                this.inputIds[key] = idGenerator(key);
            }
        });

        const field = formula.isImage ? (
            <ImageField
                value={formula.text}
                onNewImage={media_id =>
                    this.props.updateStateModel("formula.text", media_id)
                }
            />
        ) : (
            <>
                <Input
                    type="text"
                    name="formula.text"
                    id={this.inputIds.formulaText}
                    value={formula.text}
                    /* invalid={!!error} */
                    onChange={this.props.onInputChange}
                />
                {/*error && <FormFeedback>{error}</FormFeedback>*/}
            </>
        );

        const radioRow = (
            <div className="formula-field-radio-row">
                <div className="col-6">
                    <Label check>
                        <Input
                            type="radio"
                            name="formula.isImage"
                            value={false}
                            checked={!formula.isImage}
                            onChange={this.props.onInputChange}
                        />
                        Text formula
                    </Label>
                </div>
                <div className="col-6">
                    <Label check>
                        <Input
                            type="radio"
                            name="formula.isImage"
                            value={true}
                            checked={formula.isImage}
                            onChange={this.props.onInputChange}
                        />
                        Graphical formula
                    </Label>
                </div>
            </div>
        );

        return (
            <FormGroup>
                <Label for={this.inputIds.formulaText}>Formula</Label>

                <div className="formula-field compound-formula-field">
                    {radioRow}
                    {field}
                </div>
            </FormGroup>
        );
    };

    render() {
        const { prefix, model } = this.props;
        const { title, text } = model;

        return (
            <div className="compound-form">
                {this.renderHeadline()}
                <FormInput
                    type="text"
                    name="title"
                    label="Compound title"
                    value={title}
                    onChange={this.props.onInputChange}
                />
                <FormInput
                    type="textarea"
                    name="text"
                    label="Compound description"
                    value={text}
                    onChange={this.props.onInputChange}
                />
                {this.renderFormulaField()}
                {this.isNew && model.gallery && model.gallery[0] && (
                    <GalleryPostForm
                        model={model.gallery[0]}
                        onInputChange={this.updatePostState.onChange}
                        updateStateModel={this.updatePostState.update}
                    />
                )}
            </div>
        );
    }
}

export default CompoundForm;
