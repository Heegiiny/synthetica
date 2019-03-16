/**
 * Плагин для mongoose, который добавляет к схеме автоинкремент, название и дату создания,
 * а так же создаёт пагинацию для вывода списка документов постранично.
 *
 * Реализует проверку названия на уникальность и длину от 3 до 250 символов.
 *
 * Применяется в схемах, которые должны открываться на сайте в виде отдельной страницы с адресом.
 * Доступ к страницам на сайте осуществляется через параметр id, используемый в адресе.
 *
 * Для создания автоинкремента плагину требуется параметр modelName,
 * в котором надо указать название модели.
 *
 * Параметр title необходим для генерирования списка страниц.
 *
 * Использование:
 *     schema.plugin(pageSchemaPlugin, modelName);
 *
 * Если noAutoInc == true, то автоинкремент не создаётся.
 */

const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
const mongoosePaginate = require("mongoose-paginate");
const validate = require("mongoose-validator");
const uniqueValidator = require("mongoose-unique-validator");

module.exports = function pageSchemaPlugin(schema, options) {
    const modelName = typeof options === "string" ? options : options.modelName;
    const noAutoInc = typeof options === "string" ? false : options.noAutoInc;

    if (!modelName && !noAutoInc) {
        // Плагин требует указать название модели для автоинкремента.
        throw "No modelName in pageSchemaPlugin";
    }

    // Проверка длинны названия
    const titleValidator = [
        validate({
            validator: "isLength",
            arguments: [3, 250],
            message: "Название должно быть от {ARGS[0]} до {ARGS[1]} символов."
        })
    ];

    // Название и дата создания
    schema.add({
        title: {
            type: String,
            required: "Название не может быть пустым",
            unique: "Такое название уже используется",
            validate: titleValidator
        }
    });
    schema.set("timestamps", { createdAt: "createdAt" });

    // Плагин для проверки на уникальность названия
    schema.plugin(uniqueValidator);

    // Инициализация автоинкремента
    if (!noAutoInc) {
        autoIncrement.initialize(mongoose.connection);
        schema.plugin(autoIncrement.plugin, {
            model: modelName,
            field: "id",
            startAt: 1
        });
    }

    // Пагинация
    schema.plugin(mongoosePaginate);
};
