import User from "../models/user.js";


const setAuthCookie = (res, user) => {
  const userData = {
    userId: user._id,
    email: user.email,
  };

  res.cookie("auth", JSON.stringify(userData), {
    httpOnly: true,
    signed: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};


export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await User.create({ name, email, password });
    setAuthCookie(res, newUser);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error("Signup Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    const isValid = user && await user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    setAuthCookie(res, user);

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const logout = (req, res) => {
  res.clearCookie("auth");
  res.json({ message: "Logout successful" });
};


export const getProfile = async (req, res) => {
  try {
    const authCookie = req.signedCookies.auth;

    if (!authCookie) {
      return res.status(401).json({ message: "Not authenticated" });
    }
   //fetch user full ddata
    const user = await User.findById(userId).select("-password"); // Exclude sensitive fields like password
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("GetProfile Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
