/**
 * Обработчик ошибок. Возвращает разные коды для разных ошибок.
 *
 * При ошибке валидации возвращает код 422 и описание полей с ошибками.
 */

module.exports = (err, req, res, next) => {
    switch (err.name) {
        // Ошибки валидации
        case "ValidationError":
            Object.keys(err.errors).forEach(key => {
                if (
                    typeof err.errors[key] === "object" &&
                    err.errors[key].message
                ) {
                    err.errors[key] = err.errors[key].message;
                }
                const keySplit = key.split(".");
                if (keySplit.length > 1) {
                    err.errors[keySplit[keySplit.length - 1]] = err.errors[key];
                    delete err.errors[key];
                }
            });
            res.status(422).json(err);
            break;

        // Все остальные ошибки
        default:
            console.log(err);
            res.status(500).json(err);
            break;
    }
};
