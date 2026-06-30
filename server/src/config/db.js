const mongoose= require("mongoose");

let MONGO_URI=process.env.MONGO_URI

async function connectDb(){

    try{

    const client = await  mongoose.connect(MONGO_URI)
    console.log("mongoose connected")

    }catch(err){
        
        throw new Error(err)
    }


}

module.exports=connectDb