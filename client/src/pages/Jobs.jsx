import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'

function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [type, setType] = useState('')

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (location) params.append('location', location)
      if (type) params.append('type', type)

      const { data } = await API.get(`/jobs?${params.toString()}`)
      setJobs(data)
    } catch (err) {
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    fetchJobs()
  }

  const handleClear = () => {
    setSearch('')
    setLocation('')
    setType('')
  }

  const typeColors = {
    'full-time': 'bg-green-100 text-green-700',
    'part-time': 'bg-yellow-100 text-yellow-700',
    'remote': 'bg-blue-100 text-blue-700',
    'internship': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-blue-600 text-white py-10 px-6 text-center'>
        <h1 className='text-4xl font-bold mb-2'>Browse Jobs</h1>
        <p className='text-blue-100'>Find your next opportunity</p>
      </div>

      {/* Search Bar */}
      <div className='max-w-5xl mx-auto px-6 -mt-6'>
        <form
          onSubmit={handleSearch}
          className='bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row gap-3'
        >
          <input
            type='text'
            placeholder='Search by job title...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500'
          />
          <input
            type='text'
            placeholder='Location...'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500'
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500'
          >
            <option value=''>All Types</option>
            <option value='full-time'>Full Time</option>
            <option value='part-time'>Part Time</option>
            <option value='remote'>Remote</option>
            <option value='internship'>Internship</option>
          </select>
          <button
            type='submit'
            className='bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700'
          >
            Search
          </button>
          {(search || location || type) && (
            <button
              type='button'
              onClick={handleClear}
              className='border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50'
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {/* Jobs List */}
      <div className='max-w-5xl mx-auto px-6 py-8'>
        {loading ? (
          <div className='text-center py-16 text-gray-400 text-lg'>Loading jobs...</div>
        ) : error ? (
          <div className='bg-red-100 text-red-600 p-4 rounded-lg text-center'>{error}</div>
        ) : jobs.length === 0 ? (
          <div className='text-center py-16'>
            <div className='text-5xl mb-4'>🔍</div>
            <h3 className='text-xl font-bold text-gray-700 mb-2'>No jobs found</h3>
            <p className='text-gray-500'>Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <p className='text-gray-500 mb-4'>{jobs.length} job(s) found</p>
            <div className='flex flex-col gap-4'>
              {jobs.map((job) => (
                <div
                  key={job._id}
                  className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow'
                >
                  <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-1'>
                        <h2 className='text-xl font-bold text-gray-800'>{job.title}</h2>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
                          {job.type}
                        </span>
                      </div>
                      <p className='text-blue-600 font-medium mb-1'>
                        {job.company} · {job.recruiter?.name}
                      </p>
                      <p className='text-gray-500 text-sm mb-3'>
                        📍 {job.location} {job.salary && `· 💰 ${job.salary}`}
                      </p>
                      <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
                        {job.description}
                      </p>
                      {job.skills?.length > 0 && (
                        <div className='flex flex-wrap gap-2'>
                          {job.skills.map((skill, i) => (
                            <span key={i} className='bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full'>
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className='flex flex-col gap-2 w-32'>
                      <Link
                        to={`/jobs/${job._id}`}
                        className='bg-blue-600 text-white text-center px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 text-sm'
                      >
                        View Details
                      </Link>
                      <p className='text-gray-400 text-xs text-center'>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Jobs