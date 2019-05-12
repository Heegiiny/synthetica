import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import { trimPath } from "../../helpers/pathHelper";

class ModelControls extends Component {
    constructor(props) {
        super(props);

        this.state = {
            deleteModalOpen: false
        };
    }
    renderEditBtn = () => {
        const path = trimPath(this.props.match.url);
        return (
            <Link to={`/${path}/edit`}>
                <Button size="sm" outline color="secondary" className="ml-2">
                    <i className="fa fa-edit" />
                    Edit
                </Button>
            </Link>
        );
    };

    renderRemoveBtn = () => {
        const onClick = () => this.setState({ deleteModalOpen: true });
        return (
            <Button
                size="sm"
                outline
                color="danger"
                className="ml-2"
                onClick={onClick}
            >
                <i className="fa fa-trash-alt" />
                Delete
            </Button>
        );
    };

    renderDeleteModal = () => {
        const { deletePage, history, path } = this.props;
        const { title } = this.props.model;
        const cancel = () => this.setState({ deleteModalOpen: false });
        const onSubmit = () => {
            cancel();
            deletePage(() => history.push(`/${path}`));
        };

        return (
            <Modal isOpen={true} toggle={cancel}>
                <ModalHeader tag="h3" toggle={cancel}>
                    Delete {title}
                </ModalHeader>
                <ModalBody>
                    Do you really want to delete {title}? This is irreversable.
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={cancel}>
                        Cancel
                    </Button>
                    <Button color="danger" onClick={onSubmit}>
                        Delete
                    </Button>
                </ModalFooter>
            </Modal>
        );
    };

    render() {
        return (
            <>
                {this.renderEditBtn()}
                {this.renderRemoveBtn()}
                {this.state.deleteModalOpen && this.renderDeleteModal()}
            </>
        );
    }
}
export default ModelControls;
