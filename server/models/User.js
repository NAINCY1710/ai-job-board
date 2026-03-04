import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['seeker', 'recruiter'], 
    default: 'seeker' 
  },
  skills: [String],
  resume: { 
    type: String 
  },
  company: { 
    type: String 
  },
}, { timestamps: true });

userSchema.pre('save', async function () {   // ✅ removed "next"
  if (!this.isModified('password')) {
    return;                                   // ✅ removed next()
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});                                           // ✅ removed next()

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
