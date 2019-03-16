const User = require("../models/users/user");
const CompoundPost = require("../models/posts/compoundPost");
const modelRoutes = require("./routerHelpers/modelRoutes");
const subDocRoutes = require("./routerHelpers/subDocRoutes");

// Создаем пути через modelRoutes
const router = modelRoutes(User).getRouter();
/*
// Gallery paths
router.get("/:id(\\d+)/gallery", function(req, res, next) {
    req.activeDoc
        .populate("posts")
        .execPopulate()
        .then(doc => res.json(doc))
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
});*/

module.exports = router;
