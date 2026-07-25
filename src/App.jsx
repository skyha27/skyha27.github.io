import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './NavBar.jsx'
import Projects from './Projects.jsx'
import Portfolio from './portfolio.jsx'
import About from './About.jsx'

export default function App() {
  return (
    <>
      <NavBar name="Skyler Hall" />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}