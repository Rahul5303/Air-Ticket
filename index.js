const express=require("express");
// import connection
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
const cors=require("cors");
const {connection} =require("./config/db");
const {UserModel}= require("./model/UserModel");
const { authentication } = require("./middleware/authentication");

require("dotenv").config();
const app=express();

app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("HomePage");
})

// register 

app.post("/register",async(req,res)=>{
    const {name,email,password}=req.body;
    // console.log(name,email,password);
    const isUser= await UserModel.findOne({email})
    if(isUser){
        res.send({msg:"User already exists,try log in"});
    }
    else {
        bcrypt.hash(password, 5, async function(err, hash) {
        // Store hash in your password DB.
        if(err){
            res.send({msg:"Someting Went Wrong"});
        }
        const new_user= new UserModel({
            name,
            email,
            password:hash
        })
        try{
            await new_user.save();
            res.send({mgs:"SignUp SuccessFully"});
        }
        catch(err){
            res.send({msg:"Something Went Wrong,Try Again Later"});
    
        }
    });
}
})

// login

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    const user=await UserModel.findOne({email})
    const hashed_password=user.password;
    const user_id=user._id;
    console.log(user);
    console.log(user_id);
    bcrypt.compare(password, hashed_password, function(err, result) {
        // result == true
        if(err){
            res.send("Something Went Wrong,Try again Later");
        }
       
        if(result){
            const token=jwt.sign({user_id},process.env.SECRET_KEY);
            res.send({"msg":"Login SuccessFully",token});
        }
        else{
            res.send("Login Failed");
        }
    });

})

app.get("/about",(req,res)=>{
    res.send("AboutPage");
})

app.listen(8001,async()=>{
    try{
        await connection
        console.log("Connected to DB Successfully")
    }
    catch(err){
        console.log("Connection failed");
        console.log(err);
    }
    console.log("Listening to Port 8001");
})