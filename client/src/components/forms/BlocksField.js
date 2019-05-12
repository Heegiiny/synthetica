/** Editor for posts with blocks */

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
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import idGenerator from "react-id-generator";
import uploadMedia from "../../actions/uploadMedia";
import classNames from "classnames";
import youtubeThumbnail from "youtube-thumbnail";

import VideoModal from "../gallery/VideoModal";

const ENTER_KEY_CODE = 13;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;

class BlocksField extends Component {
    constructor(props) {
        super(props);
        /*
        if (!this.props.blocks.length) {
            this.props.updateStateModel("0", {});
        }*/

        this.imageUploadRef = createRef();

        this.editableBlocksRefs = [];
        this.editableBlockToFocus = null;
        this.focusedEditableBlock = 0;
    }

    updateCurrentBlock = updates => {
        if (typeof updates !== "object") {
            throw new TypeError(
                "TypeError: updateCurrentBlock() agrument must be an object."
            );
        }

        this.props.updateStateModel(this.focusedEditableBlock, {
            ...this.props.blocks[this.focusedEditableBlock],
            ...updates
        });
    };

    /** Text editor */
    addNewBlock = (block = {}) => {
        const { blocks } = this.props;
        const newBlocks = new Array(...blocks);

        let newBlockIndex;
        if (this.focusedEditableBlock !== null) {
            newBlockIndex = this.focusedEditableBlock + 1;
        } else {
            newBlockIndex = blocks.length;
        }

        newBlocks.splice(newBlockIndex, 0, block);

        this.props.updateStateModel("", newBlocks);

        return newBlockIndex;
    };

    removeBlock = blockIndex => {
        if (!blockIndex && !this.focusedEditableBlock) {
            return;
        } else if (blockIndex === undefined || blockIndex === null) {
            blockIndex = this.focusedEditableBlock;
        }

        const { blocks } = this.props;
        const newBlocks = new Array(...blocks);

        newBlocks.splice(blockIndex, 1);

        this.props.updateStateModel("", newBlocks);

        this.editableBlockToFocus = blockIndex - 1;
    };

    onContentEditableChange = event => {
        console.log(event);
    };

    onContentEditableKeyDown = event => {
        const { keyCode, target } = event;

        if (keyCode === ENTER_KEY_CODE && !event.shiftKey) {
            event.preventDefault();
            const newBlockIndex = this.addNewBlock();
            this.editableBlockToFocus = newBlockIndex;
            return;
        }

        if (keyCode === BACKSPACE_KEY_CODE && position(target).pos === 0) {
            event.preventDefault();
            this.removeBlock();
            return;
        }

        if (keyCode === DELETE_KEY_CODE && position(target).pos === 100) {
            event.preventDefault();
            this.removeBlock();
            return;
        }
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

    renderBlock = (block, index) => {
        const { text, video, image } = block;

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
                {video && (
                    <p>
                        <img src={youtubeThumbnail(video).high.url} alt="" />
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

    /** Controls and their actions */
    addVideo = videoUrl => {
        const { blocks } = this.props;
        const focusedBlock = blocks[this.focusedEditableBlock];

        if (focusedBlock.video) {
            this.addNewBlock({
                video: videoUrl
            });
        } else {
            this.updateCurrentBlock({
                video: videoUrl
            });
        }
    };

    addImage = imageUrl => {
        const { blocks } = this.props;
        const focusedBlock = blocks[this.focusedEditableBlock];

        if (focusedBlock.image) {
            this.addNewBlock({
                image: imageUrl
            });
        } else {
            this.updateCurrentBlock({
                image: imageUrl
            });
        }
    };

    uploadImage = event => {
        if (!event.target.files[0]) {
            return;
        }

        uploadMedia(event.target.files[0])
            .then(res => this.addImage(res.data.media_id))
            .catch(err => console.log(err));

        event.target.value = "";
    };

    renderBlocksControls = () => {
        const videoBtn = <VideoModal onVideoSubmit={this.addVideo} />;
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
                    onChange={this.uploadImage}
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

    getFieldClassName = () =>
        classNames("gallery-blocks-form", {
            "is-invalid": this.props.error
        });

    render() {
        const { error, blocks, label } = this.props;

        return (
            <FormGroup>
                {label && <Label>{label}</Label>}

                <div className="gallery-blocks-form">
                    <div className="controls">
                        {this.renderBlocksControls()}
                    </div>

                    <div className="gallery-blocks-editable">
                        {blocks && blocks.map(this.renderBlock)}
                    </div>
                </div>

                {error && <FormFeedback>{error}</FormFeedback>}
            </FormGroup>
        );
    }
}

export default BlocksField;
