import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import API from '../api/axios'
import jsPDF from 'jspdf'

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const ICONS = {
  location:  'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
  currency:  'M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z',
  user:      'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  calendar:  'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  check:     'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error:     'M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  mail:      'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  arrow:     'M10 19l-7-7m0 0l7-7m-7 7h18',
  robot:     'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  clipboard: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
  refresh:   'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  users:     'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
  cog:       'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
}

const Spinner = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  // Cover Letter states
  const [coverLetter, setCoverLetter] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [coverError, setCoverError] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`)
        setJob(data)
        if (user && data.applicants?.includes(user._id)) {
          setApplied(true)
        }
      } catch (err) {
        setError('Job not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchJob()
  }, [id, user])

  const handleApply = async () => {
    if (!user) { navigate('/login'); return }
    setApplying(true)
    try {
      const { data } = await API.post(`/jobs/${id}/apply`)
      setApplied(true)
      setMessage(data.message)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply.')
    } finally {
      setApplying(false)
    }
  }

  const handleGenerateCoverLetter = async () => {
    if (!user) { navigate('/login'); return }
    setGenerating(true)
    setCoverError(null)
    setCoverLetter(null)
    setCopied(false)
    try {
      const { data } = await API.post('/ai/generate-cover-letter', {
        jobTitle: job.title,
        jobDescription: job.description,
        skills: user.skills?.join(', ') || 'Not specified',
        userName: user.name,
      })
      setCoverLetter(data.coverLetter)
    } catch (err) {
      setCoverError('Failed to generate cover letter. Please try again.')
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const handleDownloadPDF = () => {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Cover Letter', 105, 20, { align: 'center' })

  // Divider line
  doc.setLineWidth(0.5)
  doc.line(20, 25, 190, 25)

  // Job title info
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100)
  doc.text(`Position: ${job.title} at ${job.company}`, 20, 35)
  doc.text(`Applicant: ${user.name}`, 20, 42)
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 49)

  // Divider line
  doc.setLineWidth(0.3)
  doc.line(20, 53, 190, 53)

  // Cover letter body
  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40)

  // splitTextToSize wraps long text to fit page width
  const lines = doc.splitTextToSize(coverLetter, 170)
  doc.text(lines, 20, 63)

  // Save the PDF
  doc.save(`Cover_Letter_${job.title}_${user.name}.pdf`)
}

  const typeColors = {
    'full-time':  'bg-green-100 text-green-700',
    'part-time':  'bg-yellow-100 text-yellow-700',
    'remote':     'bg-blue-100 text-blue-700',
    'internship': 'bg-purple-100 text-purple-700',
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='flex flex-col items-center gap-3'>
          <Spinner className='w-8 h-8 text-blue-600' />
          <p className='text-gray-400 text-sm'>Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='bg-gray-100 p-5 rounded-full w-fit mx-auto mb-4'>
            <Icon path={ICONS.error} className='w-10 h-10 text-gray-400' />
          </div>
          <h2 className='text-xl font-bold text-gray-700 mb-2'>{error}</h2>
          <button
            onClick={() => navigate('/jobs')}
            className='flex items-center gap-1 text-blue-600 hover:underline mx-auto'
          >
            <Icon path={ICONS.arrow} className='w-4 h-4' /> Back to Jobs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8 px-4'>
      <div className='max-w-3xl mx-auto'>

        {/* Back Button */}
        <button
          onClick={() => navigate('/jobs')}
          className='flex items-center gap-1 text-blue-600 hover:underline mb-6 text-sm'
        >
          <Icon path={ICONS.arrow} className='w-4 h-4' /> Back to Jobs
        </button>

        {/* Job Header */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-4'>
          <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-2xl font-bold text-gray-800'>{job.title}</h1>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                  {job.type}
                </span>
              </div>
              <p className='text-blue-600 font-semibold text-lg mb-3'>{job.company}</p>
              <div className='flex flex-wrap gap-4 text-gray-500 text-sm'>
                <span className='flex items-center gap-1'>
                  <Icon path={ICONS.location} className='w-4 h-4' /> {job.location}
                </span>
                {job.salary && (
                  <span className='flex items-center gap-1'>
                    <Icon path={ICONS.currency} className='w-4 h-4' /> {job.salary}
                  </span>
                )}
                <span className='flex items-center gap-1'>
                  <Icon path={ICONS.user} className='w-4 h-4' /> Posted by {job.recruiter?.name}
                </span>
                <span className='flex items-center gap-1'>
                  <Icon path={ICONS.calendar} className='w-4 h-4' /> {new Date(job.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Apply Button */}
            <div className='flex flex-col items-center gap-2'>
              {user?.role !== 'recruiter' && (
                <button
                  onClick={handleApply}
                  disabled={applying || applied}
                  className={`px-6 py-3 rounded-lg font-semibold w-full flex items-center justify-center gap-2
                    ${applied
                      ? 'bg-green-100 text-green-700 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'
                    }`}
                >
                  {applying ? (
                    <><Spinner className='w-4 h-4 text-white' /> Applying...</>
                  ) : applied ? (
                    <><Icon path={ICONS.check} className='w-4 h-4' /> Applied</>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              )}
              <span className='flex items-center gap-1 text-gray-400 text-xs'>
                <Icon path={ICONS.users} className='w-3.5 h-3.5' />
                {job.applicants?.length || 0} applicant(s)
              </span>
            </div>
          </div>

          {/* Success / Error messages */}
          {message && (
            <div className='mt-4 flex items-center gap-2 bg-green-100 text-green-700 p-3 rounded-lg text-sm'>
              <Icon path={ICONS.check} className='w-4 h-4 shrink-0' /> {message}
            </div>
          )}
          {error && (
            <div className='mt-4 flex items-center gap-2 bg-red-100 text-red-600 p-3 rounded-lg text-sm'>
              <Icon path={ICONS.error} className='w-4 h-4 shrink-0' /> {error}
            </div>
          )}
        </div>

        {/* Job Description */}
        <div className='bg-white rounded-xl shadow-md p-6 mb-4'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Job Description</h2>
          <p className='text-gray-600 leading-relaxed whitespace-pre-line'>
  {job.description.replace(/\*\*/g, '')}
</p>
        </div>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className='bg-white rounded-xl shadow-md p-6 mb-4'>
            <div className='flex items-center gap-2 mb-4'>
              <Icon path={ICONS.cog} className='w-5 h-5 text-blue-600' />
              <h2 className='text-xl font-bold text-gray-800'>Required Skills</h2>
            </div>
            <div className='flex flex-wrap gap-2'>
              {job.skills.map((skill, i) => (
                <span key={i} className='bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium text-sm'>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Cover Letter Generator — only for seekers */}
        {user?.role === 'seeker' && (
          <div className='bg-white rounded-xl shadow-md p-6 mb-4'>
            <div className='flex items-center justify-between mb-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-purple-100 p-2 rounded-lg'>
                  <Icon path={ICONS.robot} className='w-5 h-5 text-purple-700' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-800'>AI Cover Letter</h2>
                  <p className='text-gray-400 text-sm mt-0.5'>
                    Generate a personalized cover letter for this job
                  </p>
                </div>
              </div>
              <button
                onClick={handleGenerateCoverLetter}
                disabled={generating}
                className='flex items-center gap-2 bg-purple-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 text-sm'
              >
                {generating ? (
                  <><Spinner className='w-4 h-4 text-white' /> Generating...</>
                ) : (
                  <><Icon path={ICONS.robot} className='w-4 h-4' /> Generate</>
                )}
              </button>
            </div>

            {/* Error */}
            {coverError && (
              <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4'>
                <Icon path={ICONS.error} className='w-4 h-4 shrink-0' /> {coverError}
              </div>
            )}

            {/* Loading state */}
            {generating && (
              <div className='bg-purple-50 border border-purple-100 rounded-lg p-6 text-center'>
                <Spinner className='w-8 h-8 text-purple-600 mx-auto mb-2' />
                <p className='text-purple-600 font-medium text-sm'>AI is writing your cover letter...</p>
                <p className='text-purple-400 text-xs mt-1'>This takes 5–10 seconds</p>
              </div>
            )}

            {/* Generated Cover Letter */}
            {coverLetter && !generating && (
              <div>
                <div className='bg-gray-50 border border-gray-200 rounded-lg p-5 text-gray-700 text-sm leading-relaxed whitespace-pre-line'>
                  {coverLetter}
                </div>
                <div className='flex gap-3 mt-3'>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
                      ${copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {copied ? (
                      <><Icon path={ICONS.check} className='w-4 h-4' /> Copied!</>
                    ) : (
                      <><Icon path={ICONS.clipboard} className='w-4 h-4' /> Copy</>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPDF}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100'
                  >
                    <Icon path={ICONS.download} className='w-4 h-4' /> Download PDF
                  </button>

                  <button
                    onClick={handleGenerateCoverLetter}
                    className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100'
                  >
                    <Icon path={ICONS.refresh} className='w-4 h-4' /> Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recruiter Info */}
        <div className='bg-white rounded-xl shadow-md p-6'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>About the Recruiter</h2>
          <div className='flex flex-col gap-2'>
            <span className='flex items-center gap-2 text-gray-700 font-medium'>
              <Icon path={ICONS.user} className='w-4 h-4 text-gray-400' /> {job.recruiter?.name}
            </span>
            <span className='flex items-center gap-2 text-blue-600'>
              <Icon path={ICONS.users} className='w-4 h-4 text-gray-400' /> {job.company}
            </span>
            {job.recruiter?.email && (
              <span className='flex items-center gap-2 text-gray-500 text-sm'>
                <Icon path={ICONS.mail} className='w-4 h-4 text-gray-400' /> {job.recruiter.email}
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default JobDetail