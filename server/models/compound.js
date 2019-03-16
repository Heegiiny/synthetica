const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pageSchemaPlugin = require("./plugins/pageSchemaPlugin");
const CompoundPost = require("./posts/compoundPost");
const Synthesis = require("./synthesis");

// Создаём схему
const modelName = "Compound";
const schema = new Schema(
    {
        text: String
    },
    {
        toJSON: { virtuals: true }
    }
);

// Добавляем поля для страницы сайта
schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

schema.virtual("posts", {
    ref: "CompoundPost",
    localField: "_id",
    foreignField: "compound"
});

schema.virtual("relatedPosts", {
    ref: "CompoundPost",
    localField: "_id",
    foreignField: "otherCompounds"
});

schema.virtual("synthesesWith", {
    ref: "Synthesis",
    localField: "_id",
    foreignField: "reagents.compound"
});

schema.virtual("syntheses", {
    ref: "Synthesis",
    localField: "_id",
    foreignField: "products.compound"
});

schema.virtual("photo").get(function() {
    // Get the block with isPreview==true
    const previewPosts = this.posts.filter(post => post.isPreview);

    const post = previewPosts.length > 0 ? previewPosts[0] : this.posts[0];

    if (!post) {
        return null;
    }

    return post.preview;
});

schema.virtual("preview").get(function() {
    return this.photo;
});

const autoPopulate = function() {
    this.populate({ path: "posts", options: { limit: 5 } })
        .populate({
            path: "relatedPosts",
            options: { limit: 5 }
        })
        .populate({
            path: "synthesesWith",
            options: { limit: 5 }
        })
        .populate({
            path: "syntheses",
            options: { limit: 5 }
        });
};

schema.pre("find", function() {
    this.populate("posts");
});
schema.pre("findOne", autoPopulate);

const Compound = mongoose.model(modelName, schema);

module.exports = Compound;
