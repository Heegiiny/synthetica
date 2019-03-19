const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const pageSchemaPlugin = require("./plugins/pageSchemaPlugin");
const SynthesisPost = require("./posts/synthesisPost");
const Compound = require("./compound");

// Создаём схему
const modelName = "Synthesis";
const schema = new Schema(
    {
        reagents: [
            {
                compound: {
                    type: ObjectId,
                    required: true,
                    ref: "Compound"
                }
            }
        ],
        products: [
            {
                compound: {
                    type: ObjectId,
                    required: true,
                    ref: "Compound"
                }
            }
        ],
        formula: {
            isImage: { type: Boolean, required: true, default: false },
            text: { type: String /*required: true*/ }
        }
    },
    {
        toJSON: { virtuals: true }
    }
);

// Добавляем поля для страницы сайта
schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

schema.virtual("gallery", {
    ref: "SynthesisPost",
    localField: "_id",
    foreignField: "synthesis"
});

schema.virtual("photo").get(function() {
    // Get the block with isPreview==true
    const previewPosts = this.gallery.filter(post => post.isPreview);

    const post = previewPosts.length > 0 ? previewPosts[0] : this.gallery[0];

    if (!post) {
        return null;
    }

    return post.preview;
});

schema.virtual("preview").get(function() {
    return this.photo;
});

const autoPopulate = function() {
    this.populate({ path: "gallery", options: { limit: 5 } })
        .populate("reagents.compound")
        .populate("products.compound");
};

schema.pre("find", function() {
    this.populate("gallery");
});
schema.pre("findOne", autoPopulate);

const Synthesis = mongoose.model(modelName, schema);

module.exports = Synthesis;
