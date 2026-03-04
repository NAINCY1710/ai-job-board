import { Link } from 'react-router-dom'

function JobCard({ job }) {
  const typeColors = {
    'full-time': 'bg-green-100 text-green-700',
    'part-time': 'bg-yellow-100 text-yellow-700',
    'remote': 'bg-blue-100 text-blue-700',
    'internship': 'bg-purple-100 text-purple-700',
  }

  return (
    <div className='bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-3'>
        <div className='flex-1'>

          {/* Title + Type Badge */}
          <div className='flex items-center gap-3 mb-1'>
            <h2 className='text-xl font-bold text-gray-800'>{job.title}</h2>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${typeColors[job.type] || 'bg-gray-100 text-gray-700'}`}>
              {job.type}
            </span>
          </div>

          {/* Company + Recruiter */}
          <p className='text-blue-600 font-medium mb-1'>
            {job.company} · {job.recruiter?.name}
          </p>

          {/* Location + Salary */}
          <p className='text-gray-500 text-sm mb-3'>
            📍 {job.location} {job.salary && `· 💰 ${job.salary}`}
          </p>

          {/* Description preview */}
          <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
            {job.description}
          </p>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className='bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full'
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

        </div>

        {/* Right side */}
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
  )
}

export default JobCard