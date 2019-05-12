const Compound = require("../models/compound");
const CompoundPost = require("../models/posts/compoundPost");
const modelRoutes = require("./routerHelpers/modelRoutes");
const subDocRoutes = require("./routerHelpers/subDocRoutes");
const paginatedList = require("./routerHelpers/paginatedList");
const flatValidationError = require("../utils/flatValidationError");

// create router with modelRoutes()
const ModelRoutes = modelRoutes(Compound);

// create first post on new compound post
ModelRoutes.createDoc = (req, res, next) => {
    const doc = req.body;

    let firstPost = null;
    let firstPostErr;
    if (req.body.gallery && req.body.gallery[0]) {
        firstPost = new CompoundPost(req.body.gallery[0]);
        if (firstPost.isEmpty()) {
            firstPost = null;
        }

        if (firstPost) {
            firstPostErr = firstPost.validateSync();
        }

        if (firstPostErr) {
            const firstPostErrKeys = Object.keys(firstPostErr.errors);
            if (
                firstPostErrKeys.length === 1 &&
                firstPostErrKeys[0] === "compound"
            ) {
                firstPostErr = null;
            } else {
                delete firstPostErr.errors.compound;
                firstPostErr = flatValidationError(firstPostErr);
            }
        }
    }

    if (firstPostErr) {
        const compound = new Compound(doc);
        const compoundErr = compound.validateSync();
        if (!compoundErr) {
            compoundErr = { errors: { gallery: [firstPostErr.errors] } };
        } else {
            compoundErr.errors.gallery = [firstPostErr.errors];
        }

        return next(compoundErr);
    }

    const createFirstPost = firstPost
        ? createdDoc => {
              firstPost.compound = createdDoc._id;
              return Promise.all([createdDoc, firstPost.save()]).then(
                  ([createdDoc]) => {
                      return createdDoc.populate("gallery").execPopulate();
                  }
              );
          }
        : createdDoc => createdDoc;

    Compound.create(doc)
        .then(createFirstPost)
        .then(createdDoc => res.json(createdDoc))
        .catch(err => next(err));
};

// customize select in paginatedList()
ModelRoutes.getDocList = (req, res, next) => {
    paginatedList(Compound, req.query, res, next, "id title formula");
};

const router = ModelRoutes.getRouter();

// Gallery paths
router.get("/:id(\\d+)/gallery", function(req, res, next) {
    const query = req.query;

    query.compound = req.activeDoc._id;

    paginatedList(CompoundPost, req.query, res, next, "");
});

router.get("/:id(\\d+)/gallery/:gallery_id(\\d+)", function(req, res, next) {
    req.activeDoc
        .populate({ path: "gallery", match: { id: req.params.gallery_id } })
        .execPopulate()
        .then(doc => res.json(doc.gallery[0]))
        .catch(err => next(err));
});

router.post("/:id(\\d+)/gallery/:gallery_id(\\d+)", function(req, res, next) {
    CompoundPost.findOneAndUpdate(
        {
            id: req.params.gallery_id,
            compound: req.activeDoc._id
        },
        { $set: req.body }
    )

        .then(doc => res.json(doc))
        .catch(err => next(err));
});

router.delete("/:id(\\d+)/gallery/:gallery_id(\\d+)", function(req, res, next) {
    CompoundPost.findOneAndDelete({
        id: req.params.gallery_id,
        compound: req.activeDoc._id
    })
        .then(() =>
            req.activeDoc
                .populate({
                    path: "gallery",
                    match: { id: req.params.gallery_id }
                })
                .execPopulate()
        )
        .then(doc => res.json(doc))
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

    CompoundPost.create({
        ...req.body,
        compound: req.activeDoc._id,
        user: req.user._id
    })
        .then(post => res.json(post))
        .catch(err => next(err));
});

module.exports = router;
