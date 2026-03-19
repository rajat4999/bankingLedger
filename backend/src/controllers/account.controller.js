const accountModel=require("../models/account.model");
const transactionModel=require("../models/transaction.model")

async function createAccountController(req,res){
  const user=req.user;
  const account=await accountModel.create({
    user:user._id
  })
  res.status(201).json({
    account
  })
}

async function getUserAccountsController(req,res){
  const user=req.user;
  const accounts=await accountModel.find({user:user._id})

  return res.status(200).json({
    accounts
  })
}


async function getAccountBalanceController(req,res){
  const user=req.user;
  const {accountId}=req.params
  const account=await accountModel.findOne({_id:accountId,user:user._id})
  if(!account){
    return res.status(404).json({
      message:"Account not found"
    })
  }
  const balance=await account.getBalance()
  return res.status(200).json({
    balance:balance
  })
}


// GET: /api/accounts/:accountId/transactions
async function getAccountTransactionsController(req,res){
  try{
    const user=req.user;
    const {accountId}=req.params
    const account=await accountModel.findOne({_id:accountId,user:user._id})
    if(!account){
      return res.status(404).json({
        message:"Account not found"
      })
    }
    const transactions=await transactionModel.find({
      $or: [
        { fromAccount: accountId },
        { toAccount: accountId }
      ]
    })
    .select('_id amount fromAccount toAccount status createdAt')
    .sort({ createdAt: -1 })

    const formattedTransactions = transactions.map(tx=>{
      const isDebit=tx.fromAccount.toString()===accountId
      return {
        transactionId:tx._id,
        amount:tx.amount,
        fromAccount:tx.fromAccount,
        toAccount:tx.toAccount,
        status:tx.status,
        date:tx.createdAt,
        type:isDebit?"DEBIT":"CREDIT"
      };
    });



    return res.status(200).json({
      transactions: formattedTransactions
    })

  }
  catch(err){
    console.error("Error fetching account transactions:", err);
    return res.status(500).json({
      message:"Internal server error"
    })
  }
}


module.exports={
  createAccountController,
  getUserAccountsController,
  getAccountBalanceController,
  getAccountTransactionsController

}