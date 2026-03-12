const mongoose=require("mongoose")


function connectToDB(){
  mongoose.connect(process.env.MONGO_URL)
  .then(()=>{
    console.log("server is connected to db")
  })
  .catch(err=>{
    console.log("error");
    process.exit(1);
  })
}


module.exports=connectToDB