const router = require("express").Router();
const {
  getUserProfile,
  network,
  search,
  getAllUsers,
  getUser,
} = require("../controller/user");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);
router.get("/search", search);
router.get("/allUsers", getAllUsers);
router.get("/:userId", getUser);
router.get("/network/:uniqueCode", verifyUserAccessToken, network);

module.exports = router;
