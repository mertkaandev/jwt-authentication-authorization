const User = require("../models/User"); // User Model 
const CustomError = require("../helpers/error/CustomError"); // Custom Error
const asyncErrorWrapper = require("express-async-handler"); // Express-async-handler module for handling async error
const {sendJwtToClient} = require("../jsonwebtoken/jwt_helpers.js"); // Create token and send to client as cookie
const {validateUserInput, comparePassword} = require("../input/input_helpers.js"); // Control email-password ve compare password

// Register controller. This controller creates user and token according to "User" model with information from body.

const register = asyncErrorWrapper( async (req,res,next) => {  
    const {name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
    });

    sendJwtToClient(user,res);
});

// Login controller.

const login = asyncErrorWrapper ( async (req,res,next) => {

     const {email, password} = req.body;

     if(!validateUserInput(email,password)){
         next(new CustomError("Check Your Inputs"), 404)
     };
 
    const user = await User.findOne({email}).select("+password");
    
    if(!comparePassword(password, user.password)){
        return next(new CustomError("Please Check Your Password", 404))
    };

    sendJwtToClient(user, res);
});

// Log out controller.

const logout = asyncErrorWrapper( async (req,res,next) => {

      const {NODE_ENV} = process.env;

      return res.status(200).cookie({
          httpOnly: true,
          expires: new Date(Date.now()),
          secure: NODE_ENV === "development" ? false : true,
      }).json({
          success: false,
          message: "Logout is successful"
      })


});

// /api/auth/profile controller.

const getUser =  (req,res,next) => {
       
    res.status(200).json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    });

};
 
module.exports = {
    register,
    login,
    logout,
    getUser
};