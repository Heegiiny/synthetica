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
import isEmpty from "../../validation/is-empty";
import ErrorAlert from "../common/ErrorAlert";

class ProfileForm extends Component {
    constructor(props) {
        super(props);

        this.inputIds = {};
    }

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
        const { title } = model;

        const fieldErrors =
            errors.data && errors.data.errors ? errors.data.errors : {};

        return (
            <div className="compound-form">
                {this.renderHeadline()}

                {this.props.savePage && !isEmpty(errors) && (
                    <ErrorAlert errors={errors} />
                )}
            </div>
        );
    }
}

export default ProfileForm;
