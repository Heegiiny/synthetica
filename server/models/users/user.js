/**
 * Общая модель для пользователей на сайте. Используется для авторизации.
 * Пользователи разделены на группы при помощи дискриминатора group.
 * Новая группа пользователей должна создаваться при помощи User.discriminator()
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pageSchemaPlugin = require("../plugins/pageSchemaPlugin");
const mongooseHistory = require("../plugins/myHistoryPlugin");
const CompoundPost = require("../posts/compoundPost");
const SynthesisPost = require("../posts/synthesisPost");

// Создаём схему
const modelName = "User";
const schema = new Schema(
    {
        password: { type: String, required: true },
        email: { type: String, unique: true, required: true },
        avatar: { type: String },
        text: String,
        socials: {
            youtube: { type: String },
            twitter: { type: String },
            facebook: { type: String }
        }
    },
    {
        toJSON: { virtuals: true },
        discriminatorKey: "group",
        noVirtualId: true
    }
);

// Добавляем поля для страницы сайта
schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

schema.virtual("compoundPosts", {
    ref: "CompoundPost",
    localField: "_id",
    foreignField: "user"
});

schema.virtual("synthesisPosts", {
    ref: "SynthesisPost",
    localField: "_id",
    foreignField: "user"
});

const autoPopulate = function() {
    this.populate({ path: "compoundPosts", options: { limit: 6 } }).populate({
        path: "synthesisPosts",
        options: { limit: 6 }
    });
};

//schema.pre("find", function() {
//    this.populate("posts");
//});
schema.pre("findOne", autoPopulate);

const User = mongoose.model(modelName, schema);

module.exports = User;
