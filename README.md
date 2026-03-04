# AI Job Board — MERN Stack Project

A full-stack AI-powered job board application built with the MERN stack. Features role-based authentication, complete job management, and three AI-powered features using Groq's Llama 3 model.

## Tech Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit — global state management
- React Router DOM — client-side navigation
- Axios — API communication
- Tailwind CSS — styling

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Bcrypt — password hashing
- Multer + Cloudinary — file uploads

**AI:**
- Groq API (Llama 3.3 70b)

## Features

**Authentication:**
- JWT-based login and registration
- Two roles — Job Seeker and Recruiter
- Protected routes on both frontend and backend
- Persistent login with localStorage

**Recruiter:**
- Post, edit and delete jobs
- View all applicants per job with their skills and resume
- AI Job Description Generator

**Job Seeker:**
- Browse and apply to jobs
- AI Resume Analyzer — score, strengths, weaknesses and suggestions
- AI Cover Letter Generator with PDF download
- AI Job Recommendations based on skills
- Upload resume to profile

## AI Features

| Feature | Description |
|--------|-------------|
| Resume Analyzer | Analyzes resume and gives score, strengths and improvements |
| Cover Letter Generator | Generates personalized cover letter based on job and user skills |
| Job Description Generator | AI writes a full professional job description for recruiters |
| Job Recommendations | Matches seeker skills with available jobs |

