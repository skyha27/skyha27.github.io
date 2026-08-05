import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    if (seconds === 0) {
      navigate('/', { replace: true })
      return
    }
    const timer = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [seconds, navigate])

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1>404</h1>
      <p>Sorry, that page doesn't exist.</p>
      <p>
        Redirecting you home in {seconds}s, or{' '}
        <Link to="/">click here</Link>.
      </p>
    </div>
  )
}