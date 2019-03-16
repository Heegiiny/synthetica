const Synthesis = require("../models/synthesis");
const SynthesisPost = require("../models/posts/synthesisPost");
const modelRoutes = require("./routerHelpers/modelRoutes");
const subDocRoutes = require("./routerHelpers/subDocRoutes");

// Создаем пути через modelRoutes
const ModelRoutes = modelRoutes(Synthesis);

this.updateDoc = (req, res, next) => {
    const synthesis = req.body;

    synthesis.reagents = synthesis.reagents.map(reagent => ({
        ...reagent,
        compound: reagent.compound._id
    }));

    synthesis.products = synthesis.products.map(product => ({
        ...product,
        compound: product.compound._id
    }));

    req.activeDoc.set(synthesis);

    req.activeDoc
        .save()
        .then(doc => res.json(doc))
        .catch(err => next(err));
};

const router = ModelRoutes.getRouter();

// Добавляем пути для постов
router.get("/:id(\\d+)/posts", function(req, res, next) {
    req.activeDoc
        .populate("posts")
        .execPopulate()
        .then(doc => res.json(doc))
        .catch(err => next(err));
});

router.post("/:id(\\d+)/posts", function(req, res, next) {
    SynthesisPost.create({
        synthesis: req.activeDoc._id,
        video: req.body.video
    })
        .then(post => res.json(post))
        .catch(err => next(err));
});

module.exports = router;
