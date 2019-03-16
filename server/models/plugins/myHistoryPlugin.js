/**
 * Плагин-обёртка для работы с mongoose-history-user
 */

const mongoose = require("mongoose");
const mongooseHistoryUser = require("mongoose-history-user");

module.exports = function myHistoryPlugin(schema, modelName) {
    // Добавляем историю изменений
    schema.plugin(mongooseHistoryUser, {
        diffOnly: true,
        modifiedBy: {
            // Пользователь, внёсший изменения
            schemaType: mongoose.Schema.Types.ObjectId,
            contextPath: "request:user._id"
        }
    });

    //const Model = mongoose.model(modelName);

    schema.method("getHistory", function(offset = 0) {
        return schema.statics
            .historyModel()
            .find({ "d._id": this._id })
            .exec();
    });
};
