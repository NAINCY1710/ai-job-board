import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFail } from '../redux/slices/authSlice'
import API from '../api/axios'

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      const { data } = await API.post('/auth/login', formData)
      dispatch(loginSuccess(data))
      if (data.role === 'recruiter') {
        navigate('/recruiter/dashboard')
      } else {
        navigate('/seeker/dashboard')
      }
    } catch (err) {
      dispatch(loginFail(err.response?.data?.message || 'Login failed'))
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
      <div className='bg-white p-8 rounded-xl shadow-md w-full max-w-md'>
        <h2 className='text-3xl font-bold text-center text-gray-800 mb-6'>
          Welcome Back!
        </h2>

        {error && (
          <div className='bg-red-100 text-red-600 p-3 rounded-lg mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
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

          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50'
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className='text-center text-gray-600 mt-4'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-600 font-semibold hover:underline'>
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login