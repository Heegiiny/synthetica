const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pageSchemaPlugin = require("./plugins/pageSchemaPlugin");
//const SynthesisPost = require("./posts/synthesisPost");

// Создаём схему
const modelName = "Reaction";
const schema = new Schema(
    {},
    {
        toJSON: { virtuals: true }
    }
);

// Добавляем поля для страницы сайта
schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

//schema.virtual("posts", {
//    ref: SynthesisPost.modelName,
//    localField: "_id",
//    foreignField: "synthesis"
//});

const Reaction = mongoose.model(modelName, schema);

module.exports = Reaction;
