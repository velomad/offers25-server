const router = require("express").Router();
const {
  addUserEarning,
  userEarnings,
  allUsersEarnings,
  revertUserEarning,
} = require("../controller/earning");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// dashboard apis
router.post("/addEarning/:userId", addUserEarning);
router.get("/userEarnings/:userId", userEarnings);
router.get("/allUsersEarnings", allUsersEarnings);
router.delete("/addEarning", revertUserEarning);

// user app apis

// router.get("/user/earnings", verifyUserAccessToken, );

module.exports = router;
