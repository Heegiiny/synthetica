/**
 * Обработчик ошибок. Возвращает разные коды для разных ошибок.
 *
 * При ошибке валидации возвращает код 422 и описание полей с ошибками.
 */

const flatValidationError = require("../utils/flatValidationError");

module.exports = (err, req, res, next) => {
    switch (err.name) {
        // Ошибки валидации
        case "ValidationError":
            err = flatValidationError(err);
            res.status(422).json(err);
            break;

        // Все остальные ошибки
        default:
            console.log(err);
            res.status(500).json(err);
            break;
    }
};
