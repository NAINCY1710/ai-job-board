import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFail } from '../redux/slices/authSlice'
import API from '../api/axios'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    company: '',
    skills: '',
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.auth)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const submitData = {
        ...formData,
        skills: formData.skills.split(',').map((s) => s.trim()),
      }
      const { data } = await API.post('/auth/register', submitData)
      dispatch(loginSuccess(data))
      if (data.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else {
        navigate('/seeker/dashboard')
      }
    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || 'Registration failed'))
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center py-8'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Create Account
        </h2>

        {error && (
          <div className='bg-red-100 text-red-600 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div>
            <label className='text-gray-700 font-medium'>Full Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your full name'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label className='text-gray-700 font-medium'>Email</label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label className='text-gray-700 font-medium'>Password</label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password'
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
              required
            />
          </div>

          <div>
            <label className='text-gray-700 font-medium'>I am a</label>
            <select
              name='role'
              value={formData.role}
              onChange={handleChange}
              className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
            >
              <option value='seeker'>Job Seeker</option>
              <option value='recruiter'>Recruiter</option>
            </select>
          </div>

          {formData.role === 'recruiter' && (
            <div>
              <label className='text-gray-700 font-medium'>Company Name</label>
              <input
                type='text'
                name='company'
                value={formData.company}
                onChange={handleChange}
                placeholder='Enter your company name'
                className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
                required
              />
            </div>
          )}

          {formData.role === 'seeker' && (
            <div>
              <label className='text-gray-700 font-medium'>Skills</label>
              <input
                type='text'
                name='skills'
                value={formData.skills}
                onChange={handleChange}
                placeholder='React, Node.js, MongoDB'
                className='w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:border-blue-500'
              />
              <p className='text-gray-400 text-sm mt-1'>Separate skills with commas</p>
            </div>
          )}

          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className='text-center text-gray-600 mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-600 font-semibold hover:underline'>
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register