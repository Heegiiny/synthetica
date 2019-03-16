import React, { Component } from "react";
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
import Autosuggest from "react-autosuggest";
import SuggestionsField from "../forms/SuggestionsField";
import RelatedField from "../forms/RelatedField";

class SynthesisForm extends Component {
    constructor(props) {
        super(props);

        //this.model = props.model;
        this.isNew = !props.model._id;
        if (this.isNew) {
            this.initGalleryForm();
        }
    }

    initGalleryForm = () => {
        const newPostPrefix = "posts.0";

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
        const headerText = !this.isNew
            ? "Edit: " + this.props.model.title
            : "New Synthesis";

        return <h1>{headerText}</h1>;
    };

    render() {
        const { prefix, model, updateStateModel } = this.props;
        const { title } = model;

        return (
            <div className="synthesis-form">
                {this.renderHeadline()}
                <FormInput
                    type="text"
                    name="title"
                    label="Synthesis title"
                    value={title}
                    onChange={this.props.onInputChange}
                />

                <RelatedField
                    model={model}
                    label="Reagents"
                    name="reagents"
                    path="compounds"
                    updateStateModel={updateStateModel}
                    subPath="compound"
                />

                <RelatedField
                    model={model}
                    label="Products"
                    name="products"
                    path="compounds"
                    updateStateModel={updateStateModel}
                    subPath="compound"
                />
            </div>
        );
    }
}

export default SynthesisForm;
