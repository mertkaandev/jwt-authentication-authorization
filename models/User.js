const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;


const UserSchema = new Schema({

     name : {
         type: String,
         required: [true, "Please provide a name"]
     },
     email: {
         type: String,
         required: true,
         unique: true,
         match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid e-mail"
         ]
     },
     role: {
         type: String,
         default: "user",
         enum: ["user", "admin"],
     },
     password: {
         type: String,
         required: [true, "Please provide a password"], 
         minlength: [6, "Please provide a password longer than your input"],
         select: false,
     },
     createdAt: {
         type: Date,
         default: Date.now
     },
     title: {
         type: String
     },
     about: {
         type: String
     },
     place: {
         type: String
     },
     website: {
         type: String
     },
     profile_image: {
         type: String,
         default: "default.jpg"
     },
     blocked: {
         type: Boolean,
         default: false
     }
});

UserSchema.methods.generateJwtFromUser = function(){

    const {JWT_SECRET_KEY, JWT_EXPIRE} = process.env;

    const payload = {
        id: this.id,
        name: this.name,
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });
    
    return token;
    
};

UserSchema.pre("save", function(next){
      
     bcrypt.genSalt(10, (err,salt)=> {
         if(err) next(err);

        bcrypt.hash(this.password, salt, (err, hash)=> {

         if(err) next(err);
         this.password = hash;
         next();

         });
     });
});

module.exports = mongoose.model("User", UserSchema);