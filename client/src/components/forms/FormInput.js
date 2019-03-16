import React from "react";
import idGenerator from "react-id-generator";
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

function FormInput({ type, label, name, value, error, onChange }) {
    const inputId = idGenerator(type + "_" + name);
    return (
        <FormGroup>
            <Label for={inputId}>{label}</Label>
            <Input
                type={type}
                name={name}
                id={inputId}
                value={value}
                invalid={!!error}
                onChange={onChange}
            />
            {error && <FormFeedback>{error}</FormFeedback>}
        </FormGroup>
    );
}

export default FormInput;
