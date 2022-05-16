const CustomError = require("../../helpers/error/CustomError.js");
const jwt = require("jsonwebtoken");
const {isTokenIncluded, getAccessTokenFromHeader} = require("../../jsonwebtoken/jwt_helpers.js");

const getAccessToRoute = (req, res, next) => {

      const {JWT_SECRET_KEY} = process.env;

      if(!isTokenIncluded(req)) {
          return next(new CustomError("You are not authorized", 401));
      };

      const access_token = getAccessTokenFromHeader(req);

      jwt.verify(access_token, JWT_SECRET_KEY, (err, decoded)=> {

         if (err){
             return next(new CustomError("You are not authorized", 401))
         };

      req.user = {
          id: decoded.id,
          name: decoded.name
      };  

      console.log(decoded);
      next();
      
      });
};

module.exports = {getAccessToRoute};