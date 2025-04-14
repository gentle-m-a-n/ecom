import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
    try {
      const signedAuthCookie = req.signedCookies.auth;
  // check if signed cookie exists
      if (!signedAuthCookie) {
        return res.status(401).json({ message: "Not authenticated - auth cookie missing" });
      }
  
      const {userId} = JSON.parse(signedAuthCookie);
  //check if userId exists or not
      if (!userId) {
        return res.status(401).json({ message: "Invalid or tampered auth cookie" });
      }
  //fetch user data
     const user = await User.findById(userId).select("-password"); // Exclude sensitive fields like password
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
      req.user = user; // Attach user info to request
      next();
    } catch (error) {
      console.error("protectRoute Error:", error.message);
      return res.status(401).json({ message: "Authentication failed" });
    }
  };
  
  
  export const adminRoute = (req, res, next) => {
    try {
      if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied - admin only" });
      }
  
      next();
    } catch (error) {
      console.error("adminRoute Error:", error.message);
      return res.status(500).json({ message: "Authorization failed" });
    }
  };
  