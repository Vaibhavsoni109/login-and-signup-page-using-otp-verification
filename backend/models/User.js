const mongoose=require("mongoose")

const { Schema } = mongoose;
const UserSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    email:{
        type:String,
        required:true,
        unique:true
     },
    password: {
        type: String,
        require: true
    },
    
})
const User = mongoose.model('usersData', UserSchema);
module.exports=User;
