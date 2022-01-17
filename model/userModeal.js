const mongoose =require("mongoose");
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;


const userSchema= new Schema({
    userID:{type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,},
    firstName:{
        type : String,
        required : true
    },
    lastName:{
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password:{
        type:String,
        require:true
    },
    contactNumber:{
        type:Number,
        require:true
    },
    userType:{
        type:String,
        require:true
    }
}
   
)

module.exports = mongoose.model("user" , userSchema )
