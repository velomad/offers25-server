const router = require("express").Router();
const {
  getUserProfile,
  network,
  search,
  getAllUsers,
  getUser,
  userNetwork,
  addLead,
  leads,
  addExpoToken,
  addNeft,
  getNeft,
  updateNeft,
  addPaytmDetail,
  updatePaytmDetail,
  getPaytmDetail
} = require("../controller/user");
const { verifyUserAccessToken } = require("../middlewares/jwt");

// GET
router.get("/getProfile", verifyUserAccessToken, getUserProfile);
router.get("/search", search);
router.get("/allUsers", getAllUsers);
router.get("/details/:userId", getUser);
router.get("/network", verifyUserAccessToken, network);
router.post("/addLead", verifyUserAccessToken, addLead);
router.get("/leads", leads);
router.patch("/addExpoToken", verifyUserAccessToken, addExpoToken);
router.post("/addNeft", verifyUserAccessToken, addNeft);
router.get("/getNeft", verifyUserAccessToken, getNeft);
router.patch("/updateNeft", verifyUserAccessToken, updateNeft);
router.post("/addPaytmDetail", verifyUserAccessToken, addPaytmDetail);
router.get("/getPaytmDetail", verifyUserAccessToken, getPaytmDetail);
router.patch("/updatePaytmDetail", verifyUserAccessToken, updatePaytmDetail);

module.exports = router;
