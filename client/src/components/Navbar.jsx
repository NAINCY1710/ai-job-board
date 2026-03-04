import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

function Navbar() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className='bg-blue-600 px-6 py-4 flex justify-between items-center'>
      <Link to='/' className='text-white text-2xl font-bold'>
        AI Job Board
      </Link>

      <div className='flex gap-4 items-center'>
        <Link to='/jobs' className='text-white hover:text-blue-200'>
          Jobs
        </Link>

        {!user ? (
  <>
    <Link to='/login' className='text-white hover:text-blue-200'>
      Login
    </Link>
    <Link to='/register' className='bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50'>
      Register
    </Link>
  </>
) : (
  <>
    <Link
      to={user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard'}
      className='text-white hover:text-blue-200'
    >
      Dashboard
    </Link>
    <Link to='/profile' className='text-white hover:text-blue-200'>
      Profile
    </Link>
    <span className='text-blue-200'>Hi, {user.name}!</span>
    <button
      onClick={handleLogout}
      className='bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50'
    >
      Logout
    </button>
  </>
)}
      </div>
    </nav>
  )
}

export default Navbar