const mongoose=require("mongoose")

const connectDB=()=>mongoose.connect("mongodb+srv://horairajdev:Abu123456A@cluster0.y76yrpr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(()=>{
    console.log("DB connected");
    
})
.catch(err=>console.log(err)
)

module.exports=connectDB