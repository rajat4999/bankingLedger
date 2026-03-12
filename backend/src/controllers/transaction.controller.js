const transactionModel=require("../models/transaction.model")
const ledgerModel=require("../models/ledger.model")
const accountModel=require("../models/account.model")
const mongoose=require("mongoose")

/**
 * - Create new transaction
 * 10 steps
 * 1. validate request
 * 2. validate idempotency key
 * 3.check account status
 * 4.derive sender balance from ledger
 * 5.create transaction (pending)
 * 6.create Debit ledger entry
 * 7.create credit entry
 * 8.mark transanction completed
 * 9.commit mongoDb session
 * 10.send email notification
 * 
 */


async function createTransaction(req,res){

  // 1. validate request
  const {fromAccount,toAccount,amount,idempotencyKey}=req.body;
  if(!fromAccount || !toAccount || !amount ||!idempotencyKey) {
    return res.status(400).json({
      message:"fromAccount,toAccount, amount,idempotencyKey is required"
    })
  }

  const fromUserAccount=await accountModel.findOne({_id:fromAccount})
  const toUserAccount=await accountModel.findOne({_id:toAccount})
  if(!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      message:"Invalid fromUserAccount or toAccount"
    })
  }


  // 2. validate idempotency key

  const isTransactionAlreadyExists=await transactionModel.findOne({
    idempotencyKey:idempotencyKey
  })

  if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status==="COMPLETED"){
      return res.status(200).json({
        message:"Transaction already exixits",
        transaction:isTransactionAlreadyExists
      })
    }
    if(isTransactionAlreadyExists.status==="PENDING"){
      return res.status(200).json({
        message:"Transaction is still processing"
      })
    }
    if(isTransactionAlreadyExists.status==="FAILED"){
      return res.status(500).json({
        message:"Transaction processing is failed plese retry"
      })
    }
    if(isTransactionAlreadyExists.status==="REVERSED"){
      return res.status(500).json({
        message:"Transaction is reversed plese retry"
      })
    }
  }


  // 3.check account status

  if(fromUserAccount.status!=="ACTIVE"  || toUserAccount.status!=="ACTIVE"){
    return res.status(400).json({
      message:"both account must be active"
    })
  }


  // 4.derive send balance from ledger
  const balance =await fromUserAccount.getBalance()

  if(balance<amount){
    return res.status(400).json({
      message:`Inssufficient balance`
    })
  }

  // 5. create transaction(pending)
  const session=await mongoose.startSession()
  session.startTransaction()

  const transaction = new transactionModel({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"

  })

  const debitLedgerEntry=await ledgerModel.create([{
    account:fromAccount,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
  }],{session})
  
  


  const creditLedgerEntry=await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
  }],{session})


  transaction.status=="COMPLETED"
  await transaction.save({sesssion})


  await session.commitTransaction()
  session.endSession()


  // 10. send email notification


}

async function createInitialFundTransaction(req,res){
  const {toAccount,amount,idempotencyKey}=req.body;
  if(!toAccount || !amount ||!idempotencyKey) {
    return res.status(400).json({
      message:"toAccount, amount,idempotencyKey is required"
    })
  }
  const toUserAccount=await accountModel.findOne({_id:toAccount})
  if(!toUserAccount) {
    return res.status(400).json({
      message:"Invalid toAccount"
    })
  }
  const fromUserAccount=await accountModel.findOne({
    systemUser:true,
    user:req.user._id
  })

  if(!fromUserAccount){
    return res.status(400).json({
      message:"System user account not found"
    })
  }

  const session=await mongoose.startSession()
  session.startTransaction()      
  const transaction = new transactionModel({
    fromAccount:fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status:"PENDING"
  })

  const debitLedgerEntry=await ledgerModel.create([{
    account:fromUserAccount._id,
    amount:amount,
    transaction:transaction._id,
    type:"DEBIT"
  }],{session})

  const creditLedgerEntry=await ledgerModel.create([{
    account:toAccount,
    amount:amount,
    transaction:transaction._id,
    type:"CREDIT"
  }],{session})



  transaction.status=="COMPLETED"
  await transaction.save({sesssion})
  await session.commitTransaction()
  session.endSession()



  return res.status(200).json({
    message:"Initial fund transaction created successfully",
    transaction:transaction
  })
  
}
module.exports={
  createTransaction,
  createInitialFundTransaction
}