import React, { Component, Fragment } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "reactstrap";
import idGenerator from "react-id-generator";

class VideoModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            inputValue: this.props.video ? this.props.video : ""
        };

        this.inputId = idGenerator("videoInputText");
    }

    componentWillReceiveProps(newProps) {
        if (newProps.video !== this.props.video) {
            this.setState({
                inputValue: newProps.video ? newProps.video : ""
            });
        }
    }

    toggle = () =>
        this.setState({
            open: !this.state.open,
            inputValue: this.props.video ? this.props.video : ""
        });

    onChange = e =>
        this.setState({
            inputValue: e.target.value
        });

    onSubmit = e => {
        e.preventDefault();

        this.props.onVideoSubmit(this.state.inputValue);
        this.setState({
            open: false,
            inputValue: ""
        });
    };

    renderModal = () => {
        const { open, inputValue } = this.state;

        return (
            <Modal isOpen={open} toggle={this.toggle}>
                <Form onSubmit={this.onSubmit}>
                    <ModalHeader tag="h3" toggle={this.toggle}>
                        Add video to post
                    </ModalHeader>
                    <ModalBody>
                        <FormGroup>
                            <Label for={this.inputId}>Link to youtube</Label>
                            <Input
                                type="text"
                                id={this.inputId}
                                onChange={this.onChange}
                                value={inputValue}
                            />
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>
                            Cancel
                        </Button>
                        <Button type="submit" color="primary">
                            Add video
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    };

    renderBtn = () => {
        return (
            <Button
                color="link"
                outline
                onClick={() => this.setState({ open: true })}
            >
                <i className="fa fa-video" />
            </Button>
        );
    };

    render() {
        return (
            <>
                {this.renderBtn()}
                {this.state.open && this.renderModal()}
            </>
        );
    }
}

export default VideoModal;
