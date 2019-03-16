const Reaction = require("../models/reaction");
//const SynthesisPost = require("../models/posts/synthesisPost");
const modelRoutes = require("./routerHelpers/modelRoutes");
const subDocRoutes = require("./routerHelpers/subDocRoutes");

// Создаем пути через modelRoutes
const router = modelRoutes(Reaction).getRouter();
/*
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
});*/

module.exports = router;
