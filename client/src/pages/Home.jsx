import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
  const { user } = useSelector((state) => state.auth)

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <div className='bg-blue-600 text-white py-20 px-6 text-center'>
        <h1 className='text-5xl font-bold mb-4'>
          Find Your Dream Job with AI
        </h1>
        <p className='text-xl text-blue-100 mb-8'>
          AI powered job recommendations, resume analysis and more!
        </p>
        <div className='flex gap-4 justify-center'>
          <Link
            to='/jobs'
            className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50'
          >
            Browse Jobs
          </Link>
          {!user && (
            <Link
              to='/register'
              className='border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700'
            >
              Get Started
            </Link>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className='max-w-6xl mx-auto py-16 px-6'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>
          Why AI Job Board?
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          <div className='bg-white p-6 rounded-xl shadow-md text-center'>
            <div className='text-4xl mb-4'>🤖</div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>
              AI Resume Analyzer
            </h3>
            <p className='text-gray-600'>
              Get instant feedback on your resume with AI powered analysis and scoring.
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md text-center'>
            <div className='text-4xl mb-4'>🎯</div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>
              Smart Job Matching
            </h3>
            <p className='text-gray-600'>
              AI matches your skills with the most relevant job opportunities.
            </p>
          </div>
          <div className='bg-white p-6 rounded-xl shadow-md text-center'>
            <div className='text-4xl mb-4'>⚡</div>
            <h3 className='text-xl font-bold text-gray-800 mb-2'>
              Easy Applications
            </h3>
            <p className='text-gray-600'>
              Apply to multiple jobs with one click and track your applications.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!user && (
        <div className='bg-blue-600 text-white py-16 px-6 text-center'>
          <h2 className='text-3xl font-bold mb-4'>Ready to get started?</h2>
          <p className='text-blue-100 mb-8'>
            Join thousands of job seekers and recruiters today!
          </p>
          <Link
            to='/register'
            className='bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50'
          >
            Create Free Account
          </Link>
        </div>
      )}
    </div>
  )
}

export default Home