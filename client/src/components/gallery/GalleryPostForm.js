import React, { Component, Fragment, createRef } from "react";

import handleChangeHelper from "../../helpers/handleChangeHelper";
import FormInput from "../forms/FormInput";
import BlocksField from "../forms/BlocksField";

const ENTER_KEY_CODE = 13;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;

class GalleryPostForm extends Component {
    constructor(props) {
        super(props);

        this.isNew = !props.model._id;
        if (this.isNew) {
            this.props.updateStateModel("blocks.0", {});
        }

        this.updateBlocksState = handleChangeHelper(
            this.props.updateStateModel,
            "blocks"
        );
    }

    renderHeadline = () => {
        if (!this.props.savePage) {
            return null;
        }
        const headerText = !this.isNew
            ? "Edit: " + this.props.model.title
            : "New gallery post";

        return <h1>{headerText}</h1>;
    };

    render() {
        const { errors, model } = this.props;
        const { title, blocks } = this.props.model;

        const fieldErrors =
            errors.data && errors.data.errors ? errors.data.errors : {};

        return (
            <div className="gallery-post-form">
                {this.renderHeadline()}
                <FormInput
                    type="text"
                    name="title"
                    label="Gallery post title"
                    value={title}
                    onChange={this.props.onInputChange}
                    error={fieldErrors.text}
                />
                <BlocksField
                    label="Post text"
                    updateStateModel={this.updateBlocksState.update}
                    error={fieldErrors.blocks}
                    blocks={blocks}
                />
            </div>
        );
    }
}

export default GalleryPostForm;
