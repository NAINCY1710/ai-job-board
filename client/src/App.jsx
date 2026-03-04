import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import RecruiterDashboard from './pages/RecruiterDashboard'
import SeekerDashboard from './pages/SeekerDashboard'
import ResumeAnalyzer from './pages/ResumeAnalyzer'
import ProfilePage from './pages/ProfilePage'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/jobs' element={<Jobs />} />
        <Route path='/jobs/:id' element={<JobDetail />} />
        <Route path='/profile' element={
  <ProtectedRoute>
    <ProfilePage />
  </ProtectedRoute>
} />
        <Route path='/recruiter/dashboard' element={
          <ProtectedRoute role='recruiter'>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        <Route path='/seeker/dashboard' element={
          <ProtectedRoute role='seeker'>
            <SeekerDashboard />
          </ProtectedRoute>
        } />
        <Route path='/resume-analyzer' element={
          <ProtectedRoute role='seeker'>
            <ResumeAnalyzer />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  )
}

export default App