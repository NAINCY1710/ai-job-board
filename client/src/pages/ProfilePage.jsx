import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import API from '../api/axios'
import { updateUser } from '../redux/slices/authSlice'

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const ICONS = {
  user:     'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  mail:     'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  cog:      'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  document: 'M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v13a2 2 0 01-2 2z',
  upload:   'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  check:    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  error:    'M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  link:     'M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14',
  save:     'M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z',
}

const Spinner = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} animate-spin text-white`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

function ProfilePage() {
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [name, setName] = useState(user?.name || '')
  const [skills, setSkills] = useState(user?.skills?.join(', ') || '')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeUrl, setResumeUrl] = useState(user?.resume || null)

  const [profileLoading, setProfileLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const [profileMessage, setProfileMessage] = useState(null)
  const [profileError, setProfileError] = useState(null)
  const [resumeMessage, setResumeMessage] = useState(null)
  const [resumeError, setResumeError] = useState(null)

  const handleProfileSave = async () => {
    setProfileLoading(true)
    setProfileMessage(null)
    setProfileError(null)
    try {
      const { data } = await API.put('/auth/profile', { name, skills })
      dispatch(updateUser(data))
      setProfileMessage('Profile updated successfully.')
      // update redux if you have an updateUser action
      // dispatch(updateUser(data))
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setProfileLoading(false)
    }
  }

  const handleResumeUpload = async () => {
    if (!resumeFile) return
    setResumeLoading(true)
    setResumeMessage(null)
    setResumeError(null)
    try {
      const formData = new FormData()
      formData.append('resume', resumeFile)
      const { data } = await API.post('/auth/upload-resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
})
setResumeUrl(data.resume)
dispatch(updateUser({ resume: data.resume }))
setResumeFile(null)
setResumeMessage('Resume uploaded successfully.')
    } catch (err) {
      setResumeError(err.response?.data?.message || 'Failed to upload resume.')
    } finally {
      setResumeLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-blue-700 text-white py-8 px-6'>
        <div className='max-w-3xl mx-auto flex items-center gap-4'>
          <div className='w-14 h-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold'>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className='text-2xl font-bold'>{user?.name}</h1>
            <p className='text-blue-200 text-sm'>{user?.email} · {user?.role}</p>
          </div>
        </div>
      </div>

      <div className='max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6'>

        {/* Profile Info */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
          <div className='flex items-center gap-2 mb-5'>
            <div className='bg-blue-100 p-2 rounded-lg'>
              <Icon path={ICONS.user} className='w-5 h-5 text-blue-700' />
            </div>
            <h2 className='text-lg font-semibold text-gray-800'>Profile Information</h2>
          </div>

          <div className='flex flex-col gap-4'>
            {/* Name */}
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-1 mb-1'>
                <Icon path={ICONS.user} className='w-4 h-4 text-gray-400' /> Full Name
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500'
              />
            </div>

            {/* Email — read only */}
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center gap-1 mb-1'>
                <Icon path={ICONS.mail} className='w-4 h-4 text-gray-400' /> Email
              </label>
              <input
                type='text'
                value={user?.email}
                disabled
                className='w-full border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-50 text-gray-400 cursor-not-allowed'
              />
            </div>

            {/* Skills */}
            {user?.role === 'seeker' && (
              <div>
                <label className='text-sm font-medium text-gray-700 flex items-center gap-1 mb-1'>
                  <Icon path={ICONS.cog} className='w-4 h-4 text-gray-400' /> Skills
                </label>
                <input
                  type='text'
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder='React, Node.js, MongoDB (comma separated)'
                  className='w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500'
                />
                {skills && (
                  <div className='flex flex-wrap gap-1 mt-2'>
                    {skills.split(',').map((s, i) => s.trim() && (
                      <span key={i} className='bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full'>
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notifications */}
            {profileMessage && (
              <div className='flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm'>
                <Icon path={ICONS.check} className='w-4 h-4 shrink-0' /> {profileMessage}
              </div>
            )}
            {profileError && (
              <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm'>
                <Icon path={ICONS.error} className='w-4 h-4 shrink-0' /> {profileError}
              </div>
            )}

            <button
              onClick={handleProfileSave}
              disabled={profileLoading}
              className='flex items-center justify-center gap-2 bg-blue-700 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 disabled:opacity-50'
            >
              {profileLoading
                ? <><Spinner className='w-4 h-4' /> Saving...</>
                : <><Icon path={ICONS.save} className='w-4 h-4' /> Save Changes</>
              }
            </button>
          </div>
        </div>

        {/* Resume Upload — only for seekers */}
        {user?.role === 'seeker' && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-2 mb-5'>
              <div className='bg-green-100 p-2 rounded-lg'>
                <Icon path={ICONS.document} className='w-5 h-5 text-green-700' />
              </div>
              <h2 className='text-lg font-semibold text-gray-800'>Resume</h2>
            </div>

            {/* Current Resume */}
            {resumeUrl && (
  <div className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mb-4'>
    <div className='flex items-center gap-2'>
      <Icon path={ICONS.document} className='w-4 h-4 text-green-600' />
      <span className='text-sm text-green-700 font-medium'>Current Resume</span>
    </div>
    
      <a href={resumeUrl}
      target='_blank'
      rel='noopener noreferrer'
      className='flex items-center gap-1 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg hover:bg-green-200 transition'
    >
      <Icon path={ICONS.link} className='w-3.5 h-3.5' /> View
    </a>
  </div>
)}

            {/* Upload New */}
            <div
              onClick={() => document.getElementById('resumeInput').click()}
              className='border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition mb-4'
            >
              <input
                id='resumeInput'
                type='file'
                accept='.pdf'
                className='hidden'
                onChange={(e) => {
                  setResumeFile(e.target.files[0])
                  setResumeMessage(null)
                  setResumeError(null)
                }}
              />
              <div className='flex flex-col items-center gap-2'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <Icon path={ICONS.upload} className='w-6 h-6 text-blue-600' />
                </div>
                {resumeFile ? (
                  <>
                    <p className='text-blue-700 font-semibold text-sm'>{resumeFile.name}</p>
                    <p className='text-gray-400 text-xs'>{(resumeFile.size / 1024).toFixed(1)} KB — Click to change</p>
                  </>
                ) : (
                  <>
                    <p className='text-gray-600 text-sm font-medium'>Click to upload your resume</p>
                    <p className='text-gray-400 text-xs'>PDF only</p>
                  </>
                )}
              </div>
            </div>

            {/* Notifications */}
            {resumeMessage && (
              <div className='flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm mb-4'>
                <Icon path={ICONS.check} className='w-4 h-4 shrink-0' /> {resumeMessage}
              </div>
            )}
            {resumeError && (
              <div className='flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4'>
                <Icon path={ICONS.error} className='w-4 h-4 shrink-0' /> {resumeError}
              </div>
            )}

            <button
              onClick={handleResumeUpload}
              disabled={resumeLoading || !resumeFile}
              className='flex items-center justify-center gap-2 w-full bg-green-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50'
            >
              {resumeLoading
                ? <><Spinner className='w-4 h-4' /> Uploading...</>
                : <><Icon path={ICONS.upload} className='w-4 h-4' /> Upload Resume</>
              }
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

export default ProfilePage