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

// Gallery paths
router.get("/:id(\\d+)/gallery", function(req, res, next) {
    req.activeDoc
        .populate("gallery")
        .execPopulate()
        .then(doc => res.json(doc))
        .catch(err => next(err));
});

router.get("/:id(\\d+)/gallery/:gallery_id(\\d+)", function(req, res, next) {
    req.activeDoc
        .populate({ path: "gallery", match: { id: req.params.gallery_id } })
        .execPopulate()
        .then(doc => res.json(doc.gallery[0]))
        .catch(err => next(err));
});

router.post("/:id(\\d+)/gallery", function(req, res, next) {
    if (!req.user) {
        return res.status(403).json({
            errors: "You must log in"
        });
    }
    const blocks = req.body.blocks;
    if (!blocks) {
        res.status(400).json({
            errors: "Empty post"
        });
    }

    SynthesisPost.create({
        ...req.body,
        synthesis: req.activeDoc._id,
        user: req.user._id
    })
        .then(post => res.json(post))
        .catch(err => next(err));
});

module.exports = router;
