/**
 * Красный блок с ошибкой
 */

import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Alert } from "reactstrap";

function ErrorAlert({ errors }) {
    // Если ошибок нет, то ничего не выводим
    if (!errors || !Object.keys(errors).length) {
        return null;
    }

    let alertText = "Ошибка";
    let errorData = "";

    // Получаем сообщение об ошибке из ответа сервера
    if (typeof errors.data === "String") {
        errorData = errors.data;
    } else if (errors.data.message) {
        errorData = errors.data.message;
    } else {
        errorData = JSON.stringify(errors.data);
    }

    switch (errors.status) {
        // Особенным образом обрабатываем неправильно заполненную форму
        case 422:
            alertText = (
                <>
                    <p>Проверьте правильность заполнения формы</p>
                </>
            );
            break;
        default:
            alertText = (
                <>
                    <p>
                        Ошибка. {errors.status} {errors.statusText}
                    </p>
                    <p>{errorData}</p>
                </>
            );
            break;
    }
    return (
        <Alert color="danger" className="mt-3">
            {alertText}
        </Alert>
    );
}

ErrorAlert.propTypes = {
    errrors: PropTypes.object
};

export default ErrorAlert;
