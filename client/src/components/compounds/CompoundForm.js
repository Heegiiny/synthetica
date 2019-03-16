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

class CompoundForm extends Component {
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
            : "New compound";

        return <h1>{headerText}</h1>;
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
                {this.isNew && model.posts && model.posts[0] && (
                    <GalleryPostForm
                        model={model.posts[0]}
                        onInputChange={this.updatePostState.onChange}
                        updateStateModel={this.updatePostState.update}
                    />
                )}
            </div>
        );
    }
}

export default CompoundForm;
