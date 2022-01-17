const mongoose =require("mongoose");
var Schema = mongoose.Schema;
var ObjectIdSchema = Schema.ObjectId;

const videoDetalis= new Schema({
    videoID:{type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,},
    title:{
        type : String,
        required : true
    },
    description:{
        type : String,
        required : true
    },
    duration : {
        type : String,
        required : true
    },
    videoURL:{
        type:String,
        require:true
    },
    thumbnailURL:{
        type:String,
        require:true
    },
    viewCount:{
        type:Number,
        default:0
    }, 
    likesCount:{
        type:Number,
        default:0
    },
    educatorUsername:{
        type:String,
        require:true
    },
    subscriberCount:{
        type:Number,
        default:0

    },
    educatorID:{
        type:String
    }
}
   
)

module.exports = mongoose.model("Videos" , videoDetalis )
