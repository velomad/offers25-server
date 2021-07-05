const router = require("express").Router();
const {
  addEarning,
  showEarnings,
  revertEarning,
} = require("../controller/earning");
const { verifyUserAccessToken } = require("../middlewares/jwt");

router.post("/addEarning", verifyUserAccessToken, addEarning);
router.get("/addEarning", showEarnings);
router.delete("/addEarning", revertEarning);

module.exports = router;
