import React from "react";
import { Form } from "reactstrap";

function FormContainer({ children, onSubmit }) {
    return (
        <div className="compound-form mt-3">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 offset-lg-3">
                        <Form onSubmit={onSubmit}>{children}</Form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FormContainer;
