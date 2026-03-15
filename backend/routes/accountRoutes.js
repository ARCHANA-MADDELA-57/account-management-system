const express = require("express")
const router = express.Router()

const {
  getBalance,
  transferMoney,
  getStatement
} = require("../controllers/accountController")

const authMiddleware = require("../middlewares/authMiddleware")

router.get("/balance", authMiddleware, getBalance)

router.post("/transfer", authMiddleware, transferMoney)

router.get("/statement", authMiddleware, getStatement)

module.exports = router