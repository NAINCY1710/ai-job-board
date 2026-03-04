import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import API from '../api/axios'

function SeekerDashboard() {
  const { user } = useSelector((state) => state.auth)

  const [appliedJobs, setAppliedJobs] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [recLoading, setRecLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const { data } = await API.get('/jobs')
        const myJobs = data.filter((job) =>
          job.applicants?.includes(user._id)
        )
        setAppliedJobs(myJobs)
      } catch (err) {
        setError('Failed to load applied jobs.')
      } finally {
        setLoading(false)
      }
    }

    const fetchRecommendations = async () => {
      try {
        const { data } = await API.get('/ai/recommendations')
        setRecommendations(data)
      } catch (err) {
        // silently fail - recommendations are a bonus feature
      } finally {
        setRecLoading(false)
      }
    }

    fetchAppliedJobs()
    fetchRecommendations()
  }, [user._id])

  const typeColors = {
    'full-time': 'bg-green-100 text-green-700',
    'part-time': 'bg-yellow-100 text-yellow-700',
    'remote': 'bg-blue-100 text-blue-700',
    'internship': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-blue-600 text-white py-8 px-6'>
        <div className='max-w-5xl mx-auto flex justify-between items-center'>
          <div>
            <h1 className='text-3xl font-bold'>My Dashboard</h1>
            <p className='text-blue-100 mt-1'>Welcome back, {user?.name}!</p>
          </div>
          <div className='flex gap-3'>
            <Link
              to='/resume-analyzer'
              className='bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 text-sm'
            >
               Analyze Resume
            </Link>
            <Link
              to='/jobs'
              className='border border-white text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm'
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-6 py-8'>

        {/* Stats */}
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-xl shadow-md p-5 text-center'>
            <p className='text-3xl font-bold text-blue-600'>{appliedJobs.length}</p>
            <p className='text-gray-500 mt-1'>Jobs Applied</p>
          </div>
          <div className='bg-white rounded-xl shadow-md p-5 text-center'>
            <p className='text-3xl font-bold text-purple-600'>{recommendations.length}</p>
            <p className='text-gray-500 mt-1'>AI Recommendations</p>
          </div>
          <div className='bg-white rounded-xl shadow-md p-5 text-center col-span-2 md:col-span-1'>
            <p className='text-2xl font-bold text-green-600'>{user?.skills?.length || 0}</p>
            <p className='text-gray-500 mt-1'>Skills on Profile</p>
          </div>
        </div>

        {/* Skills */}
        {user?.skills?.length > 0 && (
          <div className='bg-white rounded-xl shadow-md p-6 mb-8'>
            <h2 className='text-xl font-bold text-gray-800 mb-3'>Your Skills</h2>
            <div className='flex flex-wrap gap-2'>
              {user.skills.map((skill, i) => (
                <span key={i} className='bg-blue-50 text-blue-700 px-4 py-2 rounded-full font-medium text-sm'>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className='mb-8'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>
            🤖 AI Job Recommendations
          </h2>

          {recLoading ? (
            <p className='text-gray-400'>Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <div className='bg-white rounded-xl shadow-md p-6 text-center'>
              <div className='text-4xl mb-3'>🎯</div>
              <p className='text-gray-600'>
                {user?.skills?.length === 0
                  ? 'Add skills to your profile to get AI recommendations!'
                  : 'No recommendations available right now.'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {recommendations.slice(0, 4).map((job) => (
                <div key={job._id} className='bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-600'>
                  <div className='flex items-start justify-between mb-2'>
                    <h3 className='font-bold text-gray-800'>{job.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                      {job.type}
                    </span>
                  </div>
                  <p className='text-blue-600 text-sm font-medium mb-1'>{job.company}</p>
                  <p className='text-gray-500 text-sm mb-3'>📍 {job.location}</p>
                  <Link
                    to={`/jobs/${job._id}`}
                    className='text-blue-600 text-sm font-semibold hover:underline'
                  >
                    View & Apply →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Applied Jobs */}
        <div>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>Applied Jobs</h2>

          {loading ? (
            <p className='text-gray-400'>Loading your applications...</p>
          ) : error ? (
            <div className='bg-red-100 text-red-600 p-4 rounded-lg'>{error}</div>
          ) : appliedJobs.length === 0 ? (
            <div className='bg-white rounded-xl shadow-md p-8 text-center'>
              <div className='text-5xl mb-4'>📬</div>
              <h3 className='text-xl font-bold text-gray-700 mb-2'>No applications yet</h3>
              <p className='text-gray-500 mb-4'>Start applying to jobs to track them here</p>
              <Link
                to='/jobs'
                className='bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700'
              >
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className='flex flex-col gap-4'>
              {appliedJobs.map((job) => (
                <div key={job._id} className='bg-white rounded-xl shadow-md p-6'>
                  <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h3 className='font-bold text-gray-800'>{job.title}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                          {job.type}
                        </span>
                      </div>
                      <p className='text-blue-600 text-sm font-medium'>{job.company}</p>
                      <p className='text-gray-500 text-sm'>📍 {job.location}</p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium'>
                        ✓ Applied
                      </span>
                      <Link
                        to={`/jobs/${job._id}`}
                        className='text-blue-600 text-sm hover:underline'
                      >
                        View Job →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default SeekerDashboard