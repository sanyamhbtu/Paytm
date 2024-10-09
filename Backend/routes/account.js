const express = require("express")
const { authMiddleware } = require("./middleware")
const mongoose = require("mongoose");
const {Account} = require('../db')
const router = express.Router()

router.post("/balance", async (req, res) => {
    try {
      const account = await Account.findOne({
        userId: req.body.userId 
      });
  
      if (!account) {
        return res.status(404).json({
          message: "Account not found"
        });
      }
  
      res.json({
        balance: account.balance
      });
    } catch (error) {
      console.error("Error fetching balance:", error);
      return res.status(500).json({
        message: "Internal server error"
      });
    }
  });
router.post("/transfer", authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();
    const {amount,to} = req.body;
    
    const account = await Account.findOne({
        userId : req.userId,
    }).session(session);

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }
    const toAccount = await Account.findOne({
        userId : to
    }).session(session);

    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({userId:req.userId},{$inc: {balance : -amount}}).session(session);
    await Account.updateOne({userId : to}, {$inc : { balance : amount}}).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer Successfully"
    });
})
module.exports = router;