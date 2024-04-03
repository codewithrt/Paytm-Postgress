const expresss = require('express');
const userRouter = require("./user");
const accRouter = require("./account");

const router = expresss.Router();

router.use("/user",userRouter); 
router.use("/account",accRouter);

module.exports = router;