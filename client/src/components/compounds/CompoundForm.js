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

import GalleryPostForm from "../gallery/GalleryPostForm";
import handleChangeHelper from "../../helpers/handleChangeHelper";
import isEmpty from "../../validation/is-empty";
import ErrorAlert from "../common/ErrorAlert";
import CompoundFormulaField from "./CompoundFormulaField";

class CompoundForm extends Component {
    constructor(props) {
        super(props);

        this.inputIds = {};

        this.updateFormulaState = handleChangeHelper(
            this.props.updateStateModel,
            "formula"
        );
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.model._id) {
            this.isNew = true;
            this.initGalleryForm();
        } else {
            this.isNew = false;
        }
    }

    componentWillUnmount() {
        this.isNew = false;
        this.galleryInited = false;
    }

    initGalleryForm = () => {
        if (this.galleryInited) {
            return;
        }
        this.galleryInited = true;
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
        const headerText = this.props.model._id
            ? "Edit: " + this.props.model.title
            : "New compound";

        return <h1>{headerText}</h1>;
    };

    render() {
        const { errors, model } = this.props;
        const { title, text } = model;

        const fieldErrors =
            errors.data && errors.data.errors ? errors.data.errors : {};

        const galleryErrors = fieldErrors.gallery
            ? {
                  errors: { data: { errors: fieldErrors.gallery[0] } }
              }
            : {};

        return (
            <div className="compound-form">
                {this.renderHeadline()}

                {this.props.savePage && !isEmpty(errors) && (
                    <ErrorAlert errors={errors} />
                )}

                <FormInput
                    type="text"
                    name="title"
                    label="Compound title"
                    value={title ? title : ""}
                    onChange={this.props.onInputChange}
                    error={fieldErrors.title}
                />
                <FormInput
                    type="textarea"
                    name="text"
                    label="Compound description"
                    value={text ? text : ""}
                    onChange={this.props.onInputChange}
                    error={fieldErrors.text}
                />
                <CompoundFormulaField
                    formula={model.formula}
                    onInputChange={this.updateFormulaState.onChange}
                    updateStateModel={this.updateFormulaState.update}
                    errors={fieldErrors.formula}
                />
                {this.isNew && model.gallery && model.gallery[0] && (
                    <>
                        <h3>First compound gallery post</h3>
                        <GalleryPostForm
                            model={model.gallery[0]}
                            onInputChange={this.updatePostState.onChange}
                            updateStateModel={this.updatePostState.update}
                            errors={galleryErrors}
                        />
                    </>
                )}
            </div>
        );
    }
}

export default CompoundForm;
