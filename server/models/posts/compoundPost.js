const mongoose = require("mongoose");
const youtubeThumbnail = require("youtube-thumbnail");

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const pageSchemaPlugin = require("../plugins/pageSchemaPlugin");
const User = require("../users/user");
const Compound = require("../compound");

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
        title: String,
        otherCompounds: [{ type: ObjectId, ref: "Compound" }],
        blocks: [postBlockSchema],
        isPreview: { type: Boolean, default: false }
    },
    {
        toJSON: { virtuals: true }
    }
);

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
    const videoBlocks = this.blocks.filter(block => !!block.video);
    return videoBlocks.length > 0;
});

schema.virtual("isGallery").get(function() {
    const imageBlocks = this.blocks.filter(block => !!block.image);
    return imageBlocks.length > 1;
});

// Добавляем поля для страницы сайта
//schema.plugin(pageSchemaPlugin, modelName);
// Добавляем историю изменений
//schema.plugin(mongooseHistory, modelName);

const CompoundPost = mongoose.model(modelName, schema);

module.exports = CompoundPost;
