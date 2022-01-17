const express =require("express");
const Videorouter =express.Router();

const videoDetalis=require("../model/EducatorVideo");
const userSchema=require("../model/userModeal")
const { body, validationResult } = require('express-validator');


//Create Video
Videorouter.post('/CreateVideo', async(req,res)=>{

    const { title, description, duration, videoURL, thumbnailURL, viewCount,likesCount,educatorID}=req.body

    if (!title) {
        return res.status(400).json({error:"Please provide title"});
      }
      else if (!description) {
          return res.status(400).json({error:"Please provide description"});
      }
      else if(!duration){
          return res.status(400).json({error:"Please provide duration"});
      }
      else if(!videoURL){
          return res.status(400).json({error:"Please provide videoURL"});
      }
      else if(!thumbnailURL){
          return res.status(400).json({error:"Please provide thumbnailURL"});
      }
      else if(!educatorID){
        return res.status(400).json({error:"Please provide educatorID"});
    }

    const user =  await userSchema.findOne( {userID : educatorID } )
    if(!user){
        return res.status(404).json({ error : "no user is Found" })
    }
    else if(user["userType"]!="Educator"){
        return res.status(404).json({ error : "video upload must be Educator" })
    }
    let userName=user["firstName"]

    const videos = new videoDetalis({ title, description, duration, videoURL, thumbnailURL, viewCount,likesCount,educatorID,educatorUsername:userName });
    videos.save(  (err,video) => {
        if(err){
            res.json(err)
        }else{
            res.status(200).json({message:"video Registered",video})
        }
    }  )

})


//Video Listing

Videorouter.get("/VideoDetails",(req,res)=>{
    videoDetalis.find({}, {videoURL:0,description:0,_id:0 } , (err,users) => {
        if(err){
            res.json(err)
        }else{
            res.json(users)
        }
    } )

})

//Video Details
Videorouter.get("/video/:videoID", async(req,res)=>{
    let videoID1=req.params.videoID
    const video =  await videoDetalis.findOne( {videoID:videoID1} )
   

   if(video == null ){
      return res.status(404).json({ error : "no Video Found" })
   }
   let viewCount= video["viewCount"]+1
    const updateValue = await videoDetalis.updateOne({videoID:videoID1},{ $set: { "viewCount": viewCount},$currentDate: { "lastModified": true }})
  
    return res.status(200).json({ message : "Video Found", "videoID":video["video"],"title":video["title"],"description":video["description"],
    "duration":video["duration"], "viewCount":video["viewCount"],"likesCount":video["likesCount"],"educatorUsername":video["educatorUsername"],"videoURL":video["videoURL"],"thumbnailURL":video["thumbnailURL"]} )
})

//Like
Videorouter.put("/Like", async(req,res)=>{
    let{userID, videoID}=req.body
    if (!userID) {
        return res.status(400).json({error:"Please provide userID"});
      }
      else if (!videoID) {
          return res.status(400).json({error:"Please provide videoID"});
      }

    const user =  await userSchema.findOne( { userID : userID } )
    if(!user){
        return res.status(404).json({ error : "no video is Found" })
    }

    const videos=await videoDetalis.findOne({"videoID": videoID})
    if(!videos){
        return res.status(404).json({ error : "no video is Found" })
    }
    let likesCount=videos["likesCount"]+1

    const updateValue = await videoDetalis.updateOne({videoID:videoID},{ $set: { "likesCount": likesCount},$currentDate: { "lastModified": true }})
    
    const videos1=await videoDetalis.findOne({"videoID": videoID})

    return res.status(200).json({"likesCount":videos1["likesCount"]}) 

})


//Unlike

Videorouter.put("/Unlike", async(req,res)=>{
    let{userID, videoID}=req.body
    if (!userID) {
        return res.status(400).json({error:"Please provide userID"});
      }
      else if (!videoID) {
          return res.status(400).json({error:"Please provide videoID"});
      }

    const user =  await userSchema.findOne( { userID : userID } )
    if(!user){
        return res.status(404).json({ error : "no video is Found" })
    }

    const videos=await videoDetalis.findOne({"videoID": videoID})
    if(!videos){
        return res.status(404).json({ error : "no video is Found" })
    }
    const videos1=await videoDetalis.findOne({"videoID": videoID})
    let likesCount=videos1["likesCount"]-1
    const updateValue = await videoDetalis.updateOne({videoID:videoID},{ $set: { "likesCount": likesCount},$currentDate: { "lastModified": true }})
    return res.status(200).json({"likesCount":videos1["likesCount"]}) 
})



//Subscribe
Videorouter.put("/Subscribe", async(req,res)=>{
    let{learnerID, educatorID}=req.body
    if (!learnerID) {
        return res.status(400).json({error:"Please provide userID"});
      }
      else if (!educatorID) {
          return res.status(400).json({error:"Please provide videoID"});
      }

      const learner=  await userSchema.findOne( { userID : learnerID } )

      if(learner["userType"]!="Learner"){
        return res.status(200).json({error:"must be learner ID"});
      }
      const educator=  await userSchema.findOne( { userID : educatorID } )

      if(educator["userType"]!="Educator"){
        return res.status(400).json({error:"must be Educator ID"});
      }

      const videos=await videoDetalis.findOne({"educatorID": educatorID})
      if(!videos){
          return res.status(404).json({ error : "no video is Found" })
      }
    
    let subscriberCount=videos["subscriberCount"]+1
    const updateValue = await videoDetalis.updateOne({educatorID:educatorID},{ $set: { "subscriberCount": subscriberCount},$currentDate: { "lastModified": true }})

    const videos1=await videoDetalis.findOne({"educatorID": educatorID})
    return res.status(200).json({"subscriberCount": videos1["subscriberCount"] })
    })


    //Unsubscribe
Videorouter.put("/Unsubscribe", async(req,res)=>{
    let{learnerID, educatorID}=req.body
    if (!learnerID) {
        return res.status(400).json({error:"Please provide userID"});
      }
      else if (!educatorID) {
          return res.status(400).json({error:"Please provide videoID"});
      }

      const learner=  await userSchema.findOne( { userID : learnerID } )

      if(learner["userType"]!="Learner"){
        return res.status(200).json({error:"must be learner ID"});
      }
      const educator=  await userSchema.findOne( { userID : educatorID } )

      if(educator["userType"]!="Educator"){
        return res.status(400).json({error:"must be Educator ID"});
      }

      const videos=await videoDetalis.findOne({"educatorID": educatorID})
      if(!videos){
          return res.status(404).json({ error : "no video is Found" })
      }
    
    let subscriberCount=videos["subscriberCount"]-1
    const updateValue = await videoDetalis.updateOne({educatorID:educatorID},{ $set: { "subscriberCount": subscriberCount}})

    const videos1=await videoDetalis.findOne({"educatorID": educatorID})
    return res.status(200).json({"subscriberCount": videos1["subscriberCount"] })
    })


    //Update Video

    Videorouter.put("/UpdateVideo", async(req,res)=>{
        let {videoID, title, description, duration, 
            educatorUsername, videoURL, thumbnailURL}=req.body;

        const videos=await videoDetalis.findOne({"videoID": videoID})
        if(!videos){
            return res.status(404).json({ error : "no video is Found" })
        }

        const updateValue = await videoDetalis.updateMany({videoID:videoID},{ $set: { "title": title,"description":description,"duration":duration,
   "educatorUsername":educatorUsername,"videoURL":videoURL,"thumbnailURL":thumbnailURL }, $currentDate: { "lastModified": true }})

   const videos1=await videoDetalis.findOne({"videoID": videoID})
   return res.status(200).json(videos1)
        
    })



    //View User Details
    Videorouter.get("/UserDetails/:username", async(req,res)=>{
        let firstName=req.params.username
        console.log(firstName)
        const user =  await userSchema.findOne( {"firstName":firstName} )

        if(user==null){
            return res.status(400).json({ error : "no user Found" })
        }
        return res.status(200).json(user)


    })


    //Update User Details

    Videorouter.put("/UpdateUserDetails", async(req,res)=>{
        let {userID, firstName, lastName, email, contactNumber, userType}=req.body;

        const user=await userSchema.findOne({"userID": userID})
        if(!user){
            return res.status(404).json({ error : "no user is Found" })
        }

        const updateValue = await userSchema.updateMany({userID:userID},{ $set: { "firstName": firstName,"lastName":lastName,"email":email,
   "contactNumber":contactNumber}, $currentDate: { "lastModified": true }})
   const user1=await userSchema.findOne({"userID": userID})
   return res.status(200).json(user1)
        
    })


module.exports = Videorouter