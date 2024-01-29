import mongoose, {Schema} from "mongoose";



const userSchema = new Schema(
    {
       
        email: {
            type: String,
           // required: true,  
        },
        fullName: {
            type: String,
            //required: true,
            trim: true, 
        },
        picturePath: {
            type: String, 
            default:""
        }
        
    },
    {
        timestamps: true
    }
)

export const User = mongoose.model("User", userSchema)
