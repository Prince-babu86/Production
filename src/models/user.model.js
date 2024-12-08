import mongoose , {Schema} from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase: true , 
        trim:trim,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase: true , 
        trim:trim,
    },
    fullName:{
        type:String,
        required:true, 
        trim:trim,
        index:true
    },
    avtar:{
        type:String, // Cloudinary url ,
        required:true,
    },
    CoverImage:{
        type:String, // Cloudinary url ,
        required:true,
    },
    WatchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true, "Password is required"]
    },
    refreshToken:{
        type:String
    }

} , {
    timestamps:true
})




// user ke data save hone se pahale function ko run karna 
userSchema.pre("save" , async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password , 10 )
    next()
})  

userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User" , userSchema)