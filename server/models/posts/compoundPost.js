const mongoose = require("mongoose");
const youtubeThumbnail = require("youtube-thumbnail");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const pageSchemaPlugin = require("../plugins/pageSchemaPlugin");
const User = require("../users/user");
const Compound = require("../compound");
const Synthesis = require("../synthesis");
const isEmpty = require("../../validation/is-empty");

const postBlockSchema = new Schema({
    video: String,
    image: String,
    text: String,
    isPreview: { Boolean, default: false }
});

// Создаём схему
const modelName = "CompoundPost";
const schema = new Schema(
    {
        user: { type: ObjectId, ref: "User" /*required: true*/ },
        compound: { type: ObjectId, ref: "Compound", required: true },
        title: { type: String, required: true },
        otherCompounds: [{ type: ObjectId, ref: "Compound" }],
        blocks: [postBlockSchema],
        isPreview: { type: Boolean, default: false }
    },
    {
        toJSON: { virtuals: true }
    }
);

schema.method("clearEmptyBlocks", function() {
    this.blocks = this.blocks.filter(
        block =>
            !isEmpty(block.video) ||
            !isEmpty(block.image) ||
            !isEmpty(block.text)
    );
});

schema.method("isEmpty", function() {
    this.clearEmptyBlocks();

    return !(this.blocks.length || (this.title && this.title.length));
});

schema.pre("validate", function() {
    this.clearEmptyBlocks();

    if (!this.blocks.length) {
        this.invalidate("blocks", "Post can't be empty");
    }
});

schema.virtual("preview").get(function() {
    function getVideoPreview(video) {
        if (!video) {
            return null;
        }
        const thumbnail = youtubeThumbnail(video);

        if (!thumbnail) {
            return null;
        }
        return thumbnail.default.url;
    }

    function getImagePreview(image) {
        return "/media/" + image;
    }

    if (!this.blocks) {
        return null;
    }

    const filteredBlocks = this.blocks.filter(
        block => block.image || block.video
    );

    // Get the block with isPreview==true
    const previewBlocks = filteredBlocks.filter(block => block.isPreview);

    const block =
        previewBlocks.length > 0 ? previewBlocks[0] : filteredBlocks[0];

    if (!block) {
        return null;
    }

    return block.video
        ? getVideoPreview(block.video)
        : getImagePreview(block.image);
});

schema.virtual("isVideo").get(function() {
    if (!this.blocks) {
        return false;
    }
    const videoBlocks = this.blocks.filter(block => !!block.video);
    return videoBlocks.length > 0;
});

schema.virtual("isGallery").get(function() {
    if (!this.blocks) {
        return false;
    }
    const imageBlocks = this.blocks.filter(block => !!block.image);
    return imageBlocks.length > 1;
});

// Добавляем поля для страницы сайта
schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

const CompoundPost = mongoose.model(modelName, schema);

module.exports = CompoundPost;
