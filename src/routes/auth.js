const router = require("express").Router();
const { register, login, validateUser } = require("../controller/auth");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.post("/register", register);

// POST
router.post("/validateuser", validateUser);

// POST
router.post("/login", login);

// UPDATE

// DELETE

module.exports = router;
