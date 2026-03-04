import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import API from '../api/axios'

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const ICONS = {
  briefcase:  'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  plus:       'M12 4v16m8-8H4',
  close:      'M6 18L18 6M6 6l12 12',
  check:      'M5 13l4 4L19 7',
  error:      'M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  edit:       'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  trash:      'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  users:      'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  user:       'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  mail:       'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  calendar:   'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  cog:        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  document:   'M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v13a2 2 0 01-2 2z',
  location:   'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  currency:   'M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z',
  robot:      'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  building:   'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9',
  clipboard:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  link:       'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
}

const Spinner = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} animate-spin text-blue-600`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

function RecruiterDashboard() {
  const { user } = useSelector((state) => state.auth)

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [formData, setFormData] = useState({
    title: '', description: '', location: '', type: 'full-time', skills: '', salary: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const [applicantsModal, setApplicantsModal] = useState(null)
  const [applicantsLoading, setApplicantsLoading] = useState(false)

  const fetchMyJobs = async () => {
    try {
      const { data } = await API.get('/jobs')
      const myJobs = data.filter(
        (job) => job.recruiter?._id === user._id || job.recruiter === user._id
      )
      setJobs(myJobs)
    } catch (err) {
      setError('Failed to load your jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMyJobs() }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage(null)
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      }
      if (editingJob) {
        await API.put(`/jobs/${editingJob._id}`, submitData)
        setMessage('Job updated successfully!')
      } else {
        await API.post('/jobs', submitData)
        setMessage('Job posted successfully!')
      }
      setFormData({ title: '', description: '', location: '', type: 'full-time', skills: '', salary: '' })
      setShowForm(false)
      setEditingJob(null)
      fetchMyJobs()
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (job) => {
    setEditingJob(job)
    setFormData({
      title: job.title, description: job.description, location: job.location,
      type: job.type, skills: job.skills?.join(', ') || '', salary: job.salary || '',
    })
    setShowForm(true)
    setMessage(null)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return
    try {
      await API.delete(`/jobs/${jobId}`)
      setMessage('Job deleted successfully.')
      fetchMyJobs()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed.')
    }
  }

  const handleGenerateDescription = async () => {
    if (!formData.title) { setError('Please enter a job title first.'); return }
    setGenerating(true)
    setError(null)
    try {
      const { data } = await API.post('/ai/generate-description', {
        title: formData.title,
        skills: formData.skills || 'Not specified',
        location: formData.location || 'Not specified',
        type: formData.type,
      })
      setFormData({ ...formData, description: data.description })
    } catch (err) {
      setError('AI generation failed. Try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleViewApplicants = async (job) => {
    setApplicantsLoading(true)
    setApplicantsModal({ jobTitle: job.title, list: [] })
    try {
      const { data } = await API.get(`/jobs/${job._id}/applicants`)
      setApplicantsModal({ jobTitle: job.title, list: data.applicants })
    } catch (err) {
      setApplicantsModal({ jobTitle: job.title, list: [], error: 'Failed to load applicants.' })
    } finally {
      setApplicantsLoading(false)
    }
  }

  const typeColors = {
    'full-time':  'bg-green-100 text-green-700',
    'part-time':  'bg-yellow-100 text-yellow-700',
    'remote':     'bg-blue-100 text-blue-700',
    'internship': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-blue-600 text-white py-8 px-6'>
        <div className='max-w-5xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>Recruiter Dashboard</h1>
            <p className='text-blue-100 mt-1'>Welcome, {user?.name} · {user?.company}</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingJob(null)
              setFormData({ title: '', description: '', location: '', type: 'full-time', skills: '', salary: '' })
              setMessage(null)
              setError(null)
            }}
            className='bg-white text-blue-600 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 flex items-center gap-2'
          >
            {showForm
              ? <><Icon path={ICONS.close} className='w-4 h-4' /> Cancel</>
              : <><Icon path={ICONS.plus} className='w-4 h-4' /> Post Job</>
            }
          </button>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-6 py-8'>

        {/* Notifications */}
        {message && (
          <div className='flex items-center gap-2 bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm'>
            <Icon path={ICONS.check} className='w-4 h-4 shrink-0' /> {message}
          </div>
        )}
        {error && (
          <div className='flex items-center gap-2 bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm'>
            <Icon path={ICONS.error} className='w-4 h-4 shrink-0' /> {error}
          </div>
        )}

        {/* Job Form */}
        {showForm && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8'>
            <h2 className='text-xl font-bold text-gray-800 mb-5'>
              {editingJob ? 'Edit Job' : 'Post a New Job'}
            </h2>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-gray-700 font-medium text-sm'>Job Title</label>
                  <input type='text' name='title' value={formData.title} onChange={handleChange}
                    placeholder='e.g. Frontend Developer'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-sm' required />
                </div>
                <div>
                  <label className='text-gray-700 font-medium text-sm'>Location</label>
                  <input type='text' name='location' value={formData.location} onChange={handleChange}
                    placeholder='e.g. Bangalore / Remote'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-sm' required />
                </div>
                <div>
                  <label className='text-gray-700 font-medium text-sm'>Job Type</label>
                  <select name='type' value={formData.type} onChange={handleChange}
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-sm'>
                    <option value='full-time'>Full Time</option>
                    <option value='part-time'>Part Time</option>
                    <option value='remote'>Remote</option>
                    <option value='internship'>Internship</option>
                  </select>
                </div>
                <div>
                  <label className='text-gray-700 font-medium text-sm'>Salary (optional)</label>
                  <input type='text' name='salary' value={formData.salary} onChange={handleChange}
                    placeholder='e.g. 10-15 LPA'
                    className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-sm' />
                </div>
              </div>
              <div>
                <label className='text-gray-700 font-medium text-sm'>Required Skills</label>
                <input type='text' name='skills' value={formData.skills} onChange={handleChange}
                  placeholder='React, Node.js, MongoDB (comma separated)'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500 text-sm' />
              </div>
              <div>
                <div className='flex justify-between items-center mb-1'>
                  <label className='text-gray-700 font-medium text-sm'>Job Description</label>
                  <button type='button' onClick={handleGenerateDescription} disabled={generating}
                    className='flex items-center gap-1 text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 disabled:opacity-50'>
                    {generating
                      ? <><Spinner className='w-3 h-3' /> Generating...</>
                      : <><Icon path={ICONS.robot} className='w-4 h-4' /> AI Generate</>
                    }
                  </button>
                </div>
                <textarea name='description' value={formData.description} onChange={handleChange}
                  placeholder='Describe the role and responsibilities...' rows={6}
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500 resize-none text-sm' required />
              </div>
              <button type='submit' disabled={submitting}
                className='bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 text-sm'>
                {submitting ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
              </button>
            </form>
          </div>
        )}

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center'>
            <div className='flex justify-center mb-2'>
              <div className='bg-blue-100 p-2 rounded-lg'>
                <Icon path={ICONS.briefcase} className='w-5 h-5 text-blue-600' />
              </div>
            </div>
            <p className='text-3xl font-bold text-blue-600'>{jobs.length}</p>
            <p className='text-gray-500 mt-1 text-sm'>Jobs Posted</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center'>
            <div className='flex justify-center mb-2'>
              <div className='bg-green-100 p-2 rounded-lg'>
                <Icon path={ICONS.users} className='w-5 h-5 text-green-600' />
              </div>
            </div>
            <p className='text-3xl font-bold text-green-600'>
              {jobs.reduce((sum, job) => sum + (job.applicants?.length || 0), 0)}
            </p>
            <p className='text-gray-500 mt-1 text-sm'>Total Applicants</p>
          </div>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-5 text-center col-span-2 md:col-span-1'>
            <div className='flex justify-center mb-2'>
              <div className='bg-purple-100 p-2 rounded-lg'>
                <Icon path={ICONS.building} className='w-5 h-5 text-purple-600' />
              </div>
            </div>
            <p className='text-2xl font-bold text-purple-600'>{user?.company || '—'}</p>
            <p className='text-gray-500 mt-1 text-sm'>Company</p>
          </div>
        </div>

        {/* My Jobs List */}
        <h2 className='text-xl font-bold text-gray-800 mb-4'>My Job Postings</h2>

        {loading ? (
          <div className='flex justify-center py-10'><Spinner className='w-8 h-8' /></div>
        ) : jobs.length === 0 ? (
          <div className='text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='flex justify-center mb-4'>
              <div className='bg-gray-100 p-4 rounded-full'>
                <Icon path={ICONS.clipboard} className='w-8 h-8 text-gray-400' />
              </div>
            </div>
            <h3 className='text-xl font-bold text-gray-700 mb-2'>No jobs posted yet</h3>
            <p className='text-gray-500 text-sm'>Click "Post Job" to add your first listing</p>
          </div>
        ) : (
          <div className='flex flex-col gap-4'>
            {jobs.map((job) => (
              <div key={job._id} className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
                <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2 mb-1'>
                      <h3 className='text-lg font-bold text-gray-800'>{job.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                        {job.type}
                      </span>
                    </div>
                    <div className='flex items-center gap-3 text-gray-500 text-sm mb-2'>
                      <span className='flex items-center gap-1'>
                        <Icon path={ICONS.location} className='w-4 h-4' /> {job.location}
                      </span>
                      {job.salary && (
                        <span className='flex items-center gap-1'>
                          <Icon path={ICONS.currency} className='w-4 h-4' /> {job.salary}
                        </span>
                      )}
                    </div>
                    <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
  {job.description.replace(/\*\*/g, '')}
</p>
                    {job.skills?.length > 0 && (
                      <div className='flex flex-wrap gap-1'>
                        {job.skills.map((skill, i) => (
                          <span key={i} className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className='flex flex-col gap-2 items-end'>
                    <button
                      onClick={() => handleViewApplicants(job)}
                      className='flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100 transition'
                    >
                      <Icon path={ICONS.users} className='w-4 h-4' />
                      {job.applicants?.length || 0} applicants
                    </button>
                    <button onClick={() => handleEdit(job)}
                      className='flex items-center gap-1 border border-blue-600 text-blue-600 px-4 py-1 rounded-lg text-sm hover:bg-blue-50'>
                      <Icon path={ICONS.edit} className='w-4 h-4' /> Edit
                    </button>
                    <button onClick={() => handleDelete(job._id)}
                      className='flex items-center gap-1 border border-red-400 text-red-500 px-4 py-1 rounded-lg text-sm hover:bg-red-50'>
                      <Icon path={ICONS.trash} className='w-4 h-4' /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Applicants Modal */}
      {applicantsModal && (
        <div
          className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4'
          onClick={() => setApplicantsModal(null)}
        >
          <div
            className='bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] flex flex-col'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100'>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 p-2 rounded-lg'>
                  <Icon path={ICONS.users} className='w-5 h-5 text-blue-700' />
                </div>
                <div>
                  <h2 className='text-lg font-bold text-gray-800'>Applicants</h2>
                  <p className='text-xs text-gray-400'>{applicantsModal.jobTitle}</p>
                </div>
              </div>
              <button onClick={() => setApplicantsModal(null)}
                className='text-gray-400 hover:text-gray-600'>
                <Icon path={ICONS.close} className='w-5 h-5' />
              </button>
            </div>

            {/* Modal Body */}
            <div className='overflow-y-auto flex-1 px-6 py-4'>
              {applicantsLoading ? (
                <div className='flex justify-center py-10'><Spinner className='w-8 h-8' /></div>
              ) : applicantsModal.error ? (
                <div className='flex items-center justify-center gap-2 py-10 text-red-500 text-sm'>
                  <Icon path={ICONS.error} className='w-5 h-5' /> {applicantsModal.error}
                </div>
              ) : applicantsModal.list.length === 0 ? (
                <div className='text-center py-10'>
                  <div className='flex justify-center mb-3'>
                    <div className='bg-gray-100 p-4 rounded-full'>
                      <Icon path={ICONS.user} className='w-8 h-8 text-gray-400' />
                    </div>
                  </div>
                  <p className='text-gray-500 font-medium'>No applicants yet</p>
                  <p className='text-gray-400 text-sm mt-1'>Share this job to attract candidates</p>
                </div>
              ) : (
                <div className='flex flex-col gap-4'>
                  {applicantsModal.list.map((applicant, i) => (
                    <div key={applicant._id || i} className='p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-3'>

                      {/* Name + Email + Date */}
                      <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm shrink-0'>
                          {applicant.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <div className='flex items-center gap-1'>
                            <Icon path={ICONS.user} className='w-3.5 h-3.5 text-gray-400' />
                            <p className='font-semibold text-gray-800 text-sm'>{applicant.name}</p>
                          </div>
                          <div className='flex items-center gap-1 mt-0.5'>
                            <Icon path={ICONS.mail} className='w-3.5 h-3.5 text-gray-400' />
                            <p className='text-gray-400 text-xs truncate'>{applicant.email}</p>
                          </div>
                        </div>
                        {applicant.createdAt && (
                          <div className='flex items-center gap-1 text-gray-400 text-xs shrink-0'>
                            <Icon path={ICONS.calendar} className='w-3.5 h-3.5' />
                            {new Date(applicant.createdAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>

                      {/* Skills */}
                      <div>
                        <div className='flex items-center gap-1 mb-1'>
                          <Icon path={ICONS.cog} className='w-3.5 h-3.5 text-gray-400' />
                          <p className='text-xs font-semibold text-gray-500'>Skills</p>
                        </div>
                        {applicant.skills?.length > 0 ? (
                          <div className='flex flex-wrap gap-1'>
                            {applicant.skills.map((skill, j) => (
                              <span key={j} className='bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full'>
                                {skill}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className='text-xs text-gray-400'>No skills listed</p>
                        )}
                      </div>

                      {/* Resume */}
                      <div>
                        <div className='flex items-center gap-1 mb-1'>
                          <Icon path={ICONS.document} className='w-3.5 h-3.5 text-gray-400' />
                          <p className='text-xs font-semibold text-gray-500'>Resume</p>
                        </div>
                        {applicant.resume ? (
                          
                            <a href={applicant.resume}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition'
                          >
                            <Icon path={ICONS.link} className='w-3.5 h-3.5' /> View Resume
                          </a>
                        ) : (
                          <p className='text-xs text-gray-400'>No resume uploaded</p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className='px-6 py-4 border-t border-gray-100'>
              <p className='text-xs text-gray-400 text-center'>
                {applicantsModal.list.length} applicant{applicantsModal.list.length !== 1 ? 's' : ''} for this role
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default RecruiterDashboard