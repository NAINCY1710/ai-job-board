import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { uploadToCloudinary } from '../middleware/uploadMiddleware.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

export const register = async (req, res) => {
  const { name, email, password, role, company, skills } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({
      name,
      email,
      password,
      role,
      company,
      skills,
    });

    await user.save();

    res.status(201).json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  skills: user.skills,
  resume: user.resume,
  token: generateToken(user._id),
})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  company: user.company,
  skills: user.skills,
  resume: user.resume,
  token: generateToken(user._id),
})

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    const { name, skills } = req.body
    if (name) user.name = name
    if (skills) user.skills = skills.split(',').map(s => s.trim()).filter(Boolean)

    await user.save()
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      skills: user.skills,
      resume: user.resume,
      company: user.company,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' })

    const result = await uploadToCloudinary(req.file.buffer, `resume_${req.user._id}`)

    const user = await User.findById(req.user._id)
    user.resume = result.secure_url
    await user.save()

    res.json({ resume: user.resume })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}