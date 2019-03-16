import React, { Component, Fragment, createRef } from "react";
import { position, offset } from "caret-pos";
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
import uploadMedia from "../../actions/uploadMedia";

const ENTER_KEY_CODE = 13;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;

class GalleryPostForm extends Component {
    constructor(props) {
        super(props);

        //document.execCommand("defaultParagraphSeparator", false, "p");

        this.isNew = !props.model._id;
        if (this.isNew) {
            this.props.updateStateModel("blocks.0", {});
        }

        this.imageUploadRef = createRef();

        this.editableBlocksRefs = [];
        this.editableBlockToFocus = null;
        this.focusedEditableBlock = null;
    }

    addVideo = () => {};

    addNewBlock = (block = {}) => {
        const { blocks } = this.props.model;
        const newBlocks = new Array(...blocks);

        let newBlockIndex;
        if (this.focusedEditableBlock !== null) {
            newBlockIndex = this.focusedEditableBlock + 1;
        } else {
            newBlockIndex = blocks.length;
        }

        newBlocks.splice(newBlockIndex, 0, block);

        this.props.updateStateModel("blocks", newBlocks);

        return newBlockIndex;
    };

    removeBlock = blockIndex => {
        if (!blockIndex && !this.focusedEditableBlock) {
            return;
        } else if (blockIndex === undefined || blockIndex === null) {
            blockIndex = this.focusedEditableBlock;
        }

        const { blocks } = this.props.model;
        const newBlocks = new Array(...blocks);

        newBlocks.splice(blockIndex, 1);

        this.props.updateStateModel("blocks", newBlocks);

        this.editableBlockToFocus = blockIndex - 1;
    };

    addImage = event => {
        if (!event.target.files[0]) {
            return;
        }

        uploadMedia(event.target.files[0])
            .then(res => {
                this.addNewBlock({
                    image: res.data.media_id
                });
            })
            .catch(err => console.log(err));

        event.target.value = "";
    };

    renderBlocksControls = () => {
        const videoBtn = (
            <Button color="link" outline onClick={this.addVideo}>
                <i className="fa fa-video" />
            </Button>
        );
        const imageBtn = (
            <>
                <Button
                    color="link"
                    outline
                    onClick={() => this.imageUploadRef.current.click()}
                >
                    <i className="fa fa-image" />
                </Button>
                <input
                    type="file"
                    ref={this.imageUploadRef}
                    onChange={this.addImage}
                />
            </>
        );

        return (
            <>
                {videoBtn}
                {imageBtn}
            </>
        );
    };

    onContentEditableChange = event => {};

    onContentEditableKeyDown = event => {
        const { keyCode, target } = event;

        if (keyCode === ENTER_KEY_CODE && !event.shiftKey) {
            event.preventDefault();
            const newBlockIndex = this.addNewBlock();
            this.editableBlockToFocus = newBlockIndex;
        }

        if (keyCode === BACKSPACE_KEY_CODE && position(target).pos === 0) {
            event.preventDefault();
            this.removeBlock();
        }
    };

    renderBlock = (block, index) => {
        const { text, video, image } = block;

        const textInputName = "blocks." + index + ".text";

        if (!this.editableBlocksRefs[index]) {
            this.editableBlocksRefs[index] = createRef();
        }

        return (
            <div className="gallery-post-form-block" key={index}>
                {image && (
                    <p>
                        <img src={"/media/" + image} alt="" />
                    </p>
                )}
                <p
                    contentEditable={true}
                    suppressContentEditableWarning={true}
                    onKeyDown={this.onContentEditableKeyDown}
                    onFocus={() => {
                        this.focusedEditableBlock = index;
                    }}
                    ref={this.editableBlocksRefs[index]}
                >
                    {text}
                </p>
            </div>
        );
    };

    componentDidUpdate() {
        if (
            this.editableBlockToFocus !== null &&
            this.editableBlocksRefs[this.editableBlockToFocus]
        ) {
            //const caretPosition =
            this.editableBlocksRefs[this.editableBlockToFocus].current.focus();
            this.editableBlockToFocus = null;
        }
    }

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
        const { title, blocks } = this.props.model;

        return (
            <div className="gallery-post-form">
                {this.renderHeadline()}
                <FormInput
                    type="text"
                    name="title"
                    label="Gallery post title"
                    value={title}
                    onChange={this.props.onInputChange}
                />
                <FormGroup>
                    <div className="gallery-blocks-form">
                        <div className="controls">
                            {this.renderBlocksControls()}
                        </div>

                        <div className="gallery-blocks-editable">
                            {blocks && blocks.map(this.renderBlock)}
                        </div>
                    </div>
                </FormGroup>
            </div>
        );
    }
}

export default GalleryPostForm;
