import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    
    const hashpassword=bcrypt.hashSync(password, 10);
    const user = await User.create({ name, email, password:hashpassword });

    res.status(201).json({
      success: true,
      user
    })

  } catch (err) {
    console.log(err);
    next(err)
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }


    return res.status(200).json({
      success: true,
      user
    });

  } catch (err) {
    console.log(err)
    next(err);
  }
};

export const GoogleLogIn=async(req,res)=>{
    try{
        const{name,email}=req.body;
        let user=await User.findOne({email})
        if(!user){
            user=await User.create({name,email});
        }
     
        return res.status(200).json({success: true,user});
    }catch(error){
        res.status(500).json({ message: `GoogleLogIn error ${error}` })
    }
}


