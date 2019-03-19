const Compound = require("../models/compound");
const CompoundPost = require("../models/posts/compoundPost");
const modelRoutes = require("./routerHelpers/modelRoutes");
const subDocRoutes = require("./routerHelpers/subDocRoutes");
const paginatedList = require("./routerHelpers/paginatedList");

// create router with modelRoutes()
const ModelRoutes = modelRoutes(Compound);

// customize select in paginatedList()
ModelRoutes.getDocList = (req, res, next) => {
    paginatedList(Compound, req.query, res, next, "id title formula");
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
    const blocks = req.body.blocks;
    if (!blocks) {
        res.status(400).json({
            errors: "Empty post"
        });
    }

    CompoundPost.create({
        ...req.body,
        compound: req.activeDoc._id
    })
        .then(post => res.json(post))
        .catch(err => next(err));
});

module.exports = router;
