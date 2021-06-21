const router = require("express").Router();
const { allOffers, create } = require("../controller/offers");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET

router.get("/alloffers", allOffers);

// POST
router.post("/create", create);

// UPDATE

// DELETE

module.exports = router;
