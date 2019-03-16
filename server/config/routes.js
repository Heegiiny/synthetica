const express = require("express");
const router = express.Router();

//adminRouter.use("/users", require("../controllers/usersController"));
router.use("/", require("../controllers/authController"));
router.use("/syntheses", require("../controllers/synthesesController"));
router.use("/reactions", require("../controllers/reactionsController"));
router.use("/compounds", require("../controllers/compoundsController"));
router.use("/users", require("../controllers/usersController"));

module.exports = router;
