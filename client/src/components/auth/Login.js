/**
 * Страница входа
 */

import React, { Component, Fragment } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    FormFeedback
} from "reactstrap";
import idGenerator from "react-id-generator";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import ErrorAlert from "../common/ErrorAlert";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            errors: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.emailInputId = idGenerator("LoginEmailInput");
        this.passwordInputId = idGenerator("LoginPasswordInput");
    }

    componentWillReceiveProps(nextProps) {
        // Если вход уже выполнен перенаправляем на главную
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/");
        }
        // Заносим ошибки в state
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors } = this.state;

        // Под названием выводим комментарий или ошибку
        const subTitle = errors.data ? (
            <ErrorAlert errors={errors} />
        ) : (
            <p className="lead text-center">
                Для работы с сайтом необходимо ввести логин и пароль
            </p>
        );

        // Извлекаем описание полей с ошибками из запроса
        let fieldErrors = {};
        if (errors.status === 422 && errors.data.errors) {
            fieldErrors = errors.data.errors;
        }

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 m-auto">
                            <h1 className="display-4 text-center">Fuel App</h1>
                            {subTitle}
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup>
                                    <Label for={this.titleInputId}>
                                        E-mail
                                    </Label>
                                    <Input
                                        type="text"
                                        name="email"
                                        id={this.emailInputId}
                                        onChange={this.handleChange}
                                        value={this.state.email}
                                        invalid={!!fieldErrors.email}
                                    />
                                    <FormFeedback>
                                        {fieldErrors.email}
                                    </FormFeedback>
                                </FormGroup>
                                <FormGroup>
                                    <Label for={this.titleInputId}>
                                        Пароль
                                    </Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id={this.epasswordInputId}
                                        onChange={this.handleChange}
                                        value={this.state.password}
                                        invalid={!!fieldErrors.password}
                                    />
                                    <FormFeedback>
                                        {fieldErrors.password}
                                    </FormFeedback>
                                </FormGroup>
                                <div className="text-center">
                                    <Button type="submit" color="primary">
                                        Войти
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);
