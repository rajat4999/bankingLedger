const {Router}= require('express')
const authMiddleware=require("../middleware/auth.middleware")
const transactionController=require("../controllers/transaction.controller")

const transactionRoutes=Router();

// create new transaction
transactionRoutes.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)


// create initial fund transaction from system user
transactionRoutes.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundTransaction)


module.exports=transactionRoutes;
