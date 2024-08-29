// kết nối collection categories
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name : {type : String, require : true}, 
    pass : {type : String , require : true}, 
    phone :{type : String, require : true},
    email : {type : String , require : true}, 
    role : {type:Boolean, default: false , require: true }, 
  
})

module.exports = mongoose.models.users || mongoose.model('users', userSchema)