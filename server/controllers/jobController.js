import Job from '../models/Job.js';

export const getAllJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: 'i' };
    if (location) query.location = { $regex: location, $options: 'i' };
    if (type) query.type = type;

    const jobs = await Job.find(query)
      .populate('recruiter', 'name company')
      .sort('-createdAt');

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('recruiter', 'name company email');

    if (!job) return res.status(404).json({ message: 'Job not found' });

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createJob = async (req, res) => {
  try {
    const { title, description, location, type, skills, salary } = req.body;

    const job = new Job({
      title,
      description,
      location,
      type,
      skills,
      salary,
      company: req.user.company,
      recruiter: req.user._id,
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.applicants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    job.applicants.push(req.user._id);
    await job.save();
    res.json({ message: 'Applied successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getJobApplicants = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('applicants', 'name email skills resume createdAt')
    if (!job) return res.status(404).json({ message: 'Job not found' })
    if (job.recruiter.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' })
    res.json({ applicants: job.applicants })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}