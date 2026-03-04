import { useState, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import API from '../api/axios'

import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const Icon = ({ path, className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
)

const ICONS = {
  robot:      'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  upload:     'M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5',
  check:      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  search:     'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z',
  error:      'M12 9v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z',
  info:       'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z',
  user:       'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  briefcase:  'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  academic:   'M12 14l9-5-9-5-9 5 9 5zm0 7v-7m0 0L3 9m9 5l9-5',
  cog:        'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  terminal:   'M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  chart:      'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  clipboard:  'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
}

const Spinner = ({ className = 'w-10 h-10' }) => (
  <svg className={`${className} animate-spin text-blue-600`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
)

function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [error, setError] = useState(null)
  const [fileName, setFileName] = useState(null)
  const fileInputRef = useRef(null)

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only.')
      return
    }

    setFileName(file.name)
    setPdfLoading(true)
    setError(null)
    setResumeText('')

    try {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

      let fullText = ''
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        fullText += pageText + '\n'
      }

      if (!fullText.trim()) {
        setError('Could not extract text from this PDF. Try pasting your resume manually.')
        setFileName(null)
        return
      }

      setResumeText(fullText.trim())
    } catch (err) {
      setError('Failed to read PDF. Try pasting your resume manually.')
      setFileName(null)
    } finally {
      setPdfLoading(false)
      e.target.value = ''
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!resumeText.trim()) return
    setLoading(true)
    setError(null)
    setAnalysis(null)
    try {
      const { data } = await API.post('/ai/analyze-resume', { resumeText })
      setAnalysis(data.analysis)
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setResumeText('')
    setAnalysis(null)
    setError(null)
    setFileName(null)
  }

  return (
    <div className='min-h-screen bg-gray-50'>

      {/* Header */}
      <div className='bg-blue-700 text-white py-10 px-6 text-center'>
        <div className='flex items-center justify-center gap-3 mb-2'>
          <Icon path={ICONS.robot} className='w-8 h-8' />
          <h1 className='text-3xl font-bold tracking-tight'>AI Resume Analyzer</h1>
        </div>
        <p className='text-blue-200 text-sm'>
          Upload your PDF or paste your resume for instant AI-powered feedback
        </p>
      </div>

      <div className='max-w-4xl mx-auto px-6 py-8'>

        <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
          <h2 className='text-lg font-semibold text-gray-800 mb-4'>Your Resume</h2>

          {/* PDF Upload Area */}
          <div
            onClick={() => fileInputRef.current.click()}
            className='border-2 border-dashed border-blue-300 rounded-xl p-6 mb-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all'
          >
            <input type='file' accept='.pdf' ref={fileInputRef} onChange={handlePdfUpload} className='hidden' />
            {pdfLoading ? (
              <div className='flex flex-col items-center gap-2'>
                <Spinner className='w-8 h-8' />
                <p className='text-blue-600 font-medium text-sm'>Reading your PDF...</p>
              </div>
            ) : fileName ? (
              <div className='flex flex-col items-center gap-2'>
                <div className='bg-green-100 p-2 rounded-full'>
                  <Icon path={ICONS.check} className='w-6 h-6 text-green-600' />
                </div>
                <p className='text-green-700 font-semibold text-sm'>{fileName}</p>
                <p className='text-gray-400 text-xs'>Click to upload a different PDF</p>
              </div>
            ) : (
              <div className='flex flex-col items-center gap-2'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <Icon path={ICONS.upload} className='w-6 h-6 text-blue-600' />
                </div>
                <p className='text-blue-600 font-semibold text-sm'>Click to upload your PDF resume</p>
                <p className='text-gray-400 text-xs'>Only PDF files supported</p>
              </div>
            )}
          </div>

          {/* OR Divider */}
          <div className='flex items-center gap-3 mb-4'>
            <div className='flex-1 h-px bg-gray-200'></div>
            <span className='text-gray-400 text-sm font-medium'>OR paste manually</span>
            <div className='flex-1 h-px bg-gray-200'></div>
          </div>

          {/* Textarea + Buttons */}
          <form onSubmit={handleAnalyze} className='flex flex-col gap-4'>
            <textarea
              value={resumeText}
              onChange={(e) => { setResumeText(e.target.value); if (fileName) setFileName(null) }}
              placeholder='Or paste your resume content here...'
              rows={10}
              className='w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none text-sm text-gray-700'
            />
            <div className='flex gap-3'>
              <button
                type='submit'
                disabled={loading || pdfLoading || !resumeText.trim()}
                className='bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2 text-sm'
              >
                {loading ? (
                  <><Spinner className='w-4 h-4' /> Analyzing...</>
                ) : (
                  <><Icon path={ICONS.search} className='w-4 h-4' /> Analyze Resume</>
                )}
              </button>
              {(resumeText || analysis) && (
                <button type='button' onClick={handleClear} className='border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50'>
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className='flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-sm'>
            <Icon path={ICONS.error} className='w-5 h-5 shrink-0 mt-0.5' />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center mb-6'>
            <Spinner className='w-10 h-10 mx-auto mb-4' />
            <p className='text-gray-700 font-medium'>Analyzing your resume...</p>
            <p className='text-gray-400 text-sm mt-1'>This usually takes 5–10 seconds</p>
          </div>
        )}

        {/* Analysis Result */}
        {analysis && !loading && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6'>
            <div className='flex items-center justify-between mb-5'>
              <div className='flex items-center gap-3'>
                <div className='bg-blue-100 p-2 rounded-lg'>
                  <Icon path={ICONS.check} className='w-5 h-5 text-blue-700' />
                </div>
                <h2 className='text-lg font-semibold text-gray-800'>Analysis Complete</h2>
              </div>
              <span className='bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium'>
                Powered by Groq AI
              </span>
            </div>

            <div className='bg-gray-50 rounded-lg p-5 border border-gray-100'>
              <div className='text-gray-700 text-sm leading-relaxed'>
                {analysis.split('\n').map((line, i) => {
                  if (line.startsWith('**') && line.endsWith('**'))
                    return <h3 key={i} className='font-bold text-gray-900 text-base mt-4 mb-2'>{line.replace(/\*\*/g, '')}</h3>
                  if (line.startsWith('* ') || line.startsWith('- '))
                    return <p key={i} className='ml-4 my-1'>• {line.slice(2)}</p>
                  if (line.includes('**'))
                    return <p key={i} className='font-semibold my-1'>{line.replace(/\*\*/g, '')}</p>
                  if (line.trim() === '') return <br key={i} />
                  if (/^\d+\.\s/.test(line) && line.endsWith(':'))
                    return <h3 key={i} className='font-bold text-gray-900 text-base mt-4 mb-2'>{line}</h3>
                  return <p key={i} className='my-1'>{line}</p>
                })}
              </div>
            </div>

            <div className='mt-5 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3'>
              <Icon path={ICONS.info} className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
              <p className='text-blue-700 text-sm'>Use these insights to improve your resume and increase your chances of getting shortlisted.</p>
            </div>

            <button onClick={handleClear} className='mt-4 border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50'>
              Analyze Another Resume
            </button>
          </div>
        )}

        {/* Tips */}
        {!analysis && !loading && (
          <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Icon path={ICONS.clipboard} className='w-5 h-5 text-blue-600' />
              <h3 className='text-base font-semibold text-gray-800'>Tips for Best Results</h3>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              {[
                { icon: ICONS.user,      text: 'Include your name, contact info and a brief summary' },
                { icon: ICONS.briefcase, text: 'List your work experience with key achievements' },
                { icon: ICONS.academic,  text: 'Add your education and certifications' },
                { icon: ICONS.cog,       text: 'List all your technical and soft skills' },
                { icon: ICONS.terminal,  text: 'Include projects with tech stack used' },
                { icon: ICONS.chart,     text: 'More detail you give, better the analysis' },
              ].map((tip, i) => (
                <div key={i} className='flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100'>
                  <Icon path={tip.icon} className='w-5 h-5 text-blue-600 shrink-0 mt-0.5' />
                  <p className='text-gray-600 text-sm'>{tip.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default ResumeAnalyzer