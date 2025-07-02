import User from "../model/user.model.js";
import bcryptjs from "bcryptjs"
export const signup = async(req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const user = await  User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        const hashPassword=await bcryptjs.hash(password,10)
        const createdUser = new User({
            fullname:fullname,
            email:email,
            password:hashPassword,
        });
        await createdUser.save();
        res.status(201).json({
            message: "User created successfully",
            user:{
                _id: createdUser._id,
                fullname: createdUser.fullname,
                email: createdUser.email
            },
        });
    } catch (error) {
        if (err.response) {
            // Backend returned an error response (status code outside of 2xx)
            console.error("Error response:", err.response.data);
            alert("Error: " + err.response.data.message || "Unknown server error");
          } else if (err.request) {
            // Request was made but no response received
            console.error("Error request:", err.request);
          } else {
            // Something else went wrong during request setup
            console.error("Error message:", err.message);
          }
    }
};
export const login = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid username or password" });
        } else {
            res.status(200).json({
                message: "Login successful",
                user: {
                    _id: user._id,
                    fullname: user.fullname,
                    email: user.email,
                },
            });
        }
    } catch (error) {
        console.log("Error: " + error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
