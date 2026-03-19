const express=require("express")
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")


const router=express.Router()



router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)



// get all account of logged in user

router.get("/",authMiddleware.authMiddleware,accountController.getUserAccountsController)

router.get("/balance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalanceController)




// get transaction history for an account
router.get("/:accountId/transactions",authMiddleware.authMiddleware,accountController.getAccountTransactionsController);







module.exports=router