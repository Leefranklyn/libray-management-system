import jwt from "jsonwebtoken";

export const verifyToken = (useType) => async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token)
    if (!token) return res.status(401).json({
      message: "You are not authenticated",
    });
   
    jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
      if (err) return res.status(401).json({
        message: "Token is not valid",
      });
  
      if (useType && payload.useType !== useType) {
        return res.status(403).json({
          message: "Forbidden. Invalid useType.",
        });
      }
  
      req.user = payload.id;
      next();
    });
  };

