import React, { Component, createRef } from "react";
import uploadMedia from "../../actions/uploadMedia";

class ImageField extends Component {
    constructor(props) {
        super(props);

        this.fileInputRef = createRef();
    }

    addImage = event => {
        if (!event.target.files[0]) {
            return;
        }

        uploadMedia(event.target.files[0])
            .then(res => {
                this.props.onNewImage(res.data.media_id);
            })
            .catch(err => console.log(err));

        event.target.value = "";
    };

    renderFileInput = () => (
        <input
            className={this.props.value ? "d-none" : ""}
            type="file"
            ref={this.fileInputRef}
            onChange={this.addImage}
        />
    );

    renderImage = () => {
        const { value } = this.props;
        if (value && value.length > 0) {
            return (
                <img
                    src={`/media/${value}`}
                    onClick={() => this.fileInputRef.current.click()}
                />
            );
        }
        return null;
    };

    render() {
        return (
            <div className="image-field">
                {this.renderFileInput()}
                {this.renderImage()}
            </div>
        );
    }
}

export default ImageField;
