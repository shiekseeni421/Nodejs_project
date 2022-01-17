const express =require("express");
const router =express.Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const userSchema=require("../model/userModeal");
const { body, validationResult } = require('express-validator');

router.post("/register" , 
body('email').isEmail(), (req,res) =>{
    const { firstName,lastName,email,password,contactNumber,userType}=req.body

    if (firstName==null) {
        return res.status(400).json({error:"Please provide firstName"});
      }
      else if (lastName==null) {
          return res.status(400).json({error:"Please provide lastName"});
      }
      else if(email==null){
          return res.status(400).json({error:"Please provide email"});
      }
      else if(password==null){
          return res.status(400).json({error:"Please provide password"});
      }
      else if(contactNumber==null){
          return res.status(400).json({error:"Please provide contactNumber"});
      }
      else if(userType==null){
          return res.status(400).json({error:"Please provide userType"});
      }

      if(userType=="Educator"){
          let indexLetter=email.indexOf('@')
          let value=(email.slice(indexLetter,(email.length)))
          if (value!="@edyoda.com"){
            return res.status(400).json({error:"Please Educator email Like @edyoda.com"});
          }
      }else if(userType=="Learner"){
        let indexLetter=email.indexOf('@')
        let value=(email.slice(indexLetter,(email.length)))
        if (value!="@gmail.com"){
          return res.status(400).json({error:"Please Educator email Like @gmail.com"});

        }

      }

    var hashedPassword = bcrypt.hashSync(password, 10);
    const user = new userSchema({ firstName,lastName,email,contactNumber,userType, password: hashedPassword });
    user.save(  (err,user) => {
        if(err){
            res.json(err)
        }else{
            res.status(200).json({message:"user Register sucessfuly"})
        }
    }  )
}  )

router.post("/Login",async(req,res)=>{
    const{password,email}=req.body;
    if(!email||!password){
        if(!email){
            res.send("email required")
        }
        else if(!password){
            res.send("password required")
        }
    }
    const user =  await userSchema.findOne( { email : email  } )
   if(user == null ){
      return res.status(404).json({ error : "no user is registered with this email" })
   }
   const result = bcrypt.compareSync(password  , user.password )
   if(result == true){
       const token =  jwt.sign( { email : user.email} , "shhh"  );
       res.status(200).send("Login Successful")
   }else{
    return res.status(400).send({error:"Invalid Login Credentials"})
   }
});



module.exports = router

