import Groq from 'groq-sdk';
import Job from '../models/Job.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Resume Analyzer
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR consultant and resume analyzer. 
          Analyze the given resume and provide:
          1. Overall score out of 10
          2. Key strengths (list 3-5 points)
          3. Areas of improvement (list 3-5 points)
          4. Skills extracted
          5. Suggested job roles that match this resume
          Keep your response structured and concise.`,
        },
        {
          role: 'user',
          content: `Please analyze this resume: ${resumeText}`,
        },
      ],
    });

    const analysis = completion.choices[0].message.content;
    res.json({ analysis });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Job Recommendations
export const getJobRecommendations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const jobs = await Job.find().populate('recruiter', 'name company');

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please add skills to your profile to get recommendations',
      });
    }

    const jobsList = jobs.map(job => ({
      id: job._id,
      title: job.title,
      company: job.company,
      skills: job.skills,
      location: job.location,
      type: job.type,
    }));

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a job recommendation expert. 
          Based on the user's skills, recommend the most suitable jobs from the provided list.
          Return ONLY a JSON array of recommended job IDs in order of relevance like this:
          ["id1", "id2", "id3"]
          Return maximum 5 recommendations. Return ONLY the JSON array, nothing else.`,
        },
        {
          role: 'user',
          content: `User skills: ${user.skills.join(', ')}
          Available jobs: ${JSON.stringify(jobsList)}
          Which jobs are most suitable for this user?`,
        },
      ],
    });

    const recommendedIdsText = completion.choices[0].message.content;
    const recommendedIds = JSON.parse(recommendedIdsText);

    const recommendedJobs = jobs.filter(job =>
      recommendedIds.includes(job._id.toString())
    );

    res.json(recommendedJobs);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate Job Description
export const generateJobDescription = async (req, res) => {
  try {
    const { title, skills, location, type } = req.body;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert HR professional. 
          Generate a professional, attractive job description.
          Include: role overview, responsibilities, requirements, and benefits.
          Keep it between 200-300 words.`,
        },
        {
          role: 'user',
          content: `Generate a job description for:
          Title: ${title}
          Required Skills: ${skills}
          Location: ${location}
          Job Type: ${type}
          "Do not use markdown formatting like ** or * in your response. Use plain text only."`,
        },
      ],
    });

    const description = completion.choices[0].message.content;
    res.json({ description });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @POST /api/ai/generate-cover-letter
// @POST /api/ai/generate-cover-letter
export const generateCoverLetter = async (req, res) => {
  try {
    const { jobTitle, jobDescription, skills, userName } = req.body

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a professional career coach. Write a compelling cover letter in plain text only. No markdown, no ** symbols, no bullet points. Just clean professional paragraphs.',
        },
        {
          role: 'user',
          content: `Write a cover letter for:
Name: ${userName}
Applying for: ${jobTitle}
Job Description: ${jobDescription}
My Skills: ${skills}

Write 3 short paragraphs: introduction, why I am a good fit, closing.`,
        },
      ],
      max_tokens: 500,
    })

    res.json({ coverLetter: completion.choices[0].message.content })

  } catch (error) {
    console.error('Cover letter error:', error.message)
    res.status(500).json({ message: error.message })
  }
}