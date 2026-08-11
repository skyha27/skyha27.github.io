import './about.css'

export default function About() {
  return (
    <div style={{ padding: '40px 24px' }}>
      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 40 }}>
        <div style={{ width: '60%', maxWidth: 1100, minWidth: 320, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 80 }}>
          <p>Hi! My name is Skyler Hall, but most people call me Sky. I'm a current Junior at Brown University studying Computer Engineering, with a passion for combining creativity and technology.</p>
          <p>I am interested in the intersection of technical problem solving and creative development, particularly in animation, games, and themed entertainment. Through coursework and personal projects, I've explored both sides by building tools, debugging issues, and experiementing with various creative mediums. </p>
          <p>Most recently, I worked as an intern for Universal Creative, working on tools and softwares to support themed entertainment experiences.</p>
          <p>In my free time, I love playing video games and going to the movies!</p>
        </div>

        <div style={{ flex: 1, minWidth: 200 }}>
          <img
            src="/images/sky.jpeg"
            alt="Skyler Hall"
            style={{ width: '100%', height: 'auto', borderRadius: 200 }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, padding: '24px 0' }}>
        <a href="https://www.linkedin.com/in/skylerghall/" target="_blank" rel="noopener noreferrer">
          <img src="/images/logos/linkedin_logo.png" alt="LinkedIn" style={{ width: 28, height: 28 }} />
        </a>
        <a href="https://github.com/skyha27" target="_blank" rel="noopener noreferrer">
          <img src="/images/logos/github_logo.png" alt="GitHub" style={{ width: 28, height: 28 }} />
        </a>
        <a href="https://vimeo.com/1148496002?fl=pl&fe=ti" target="_blank" rel="noopener noreferrer">
          <img src="/images/logos/vimeo_logo.png" alt="Vimeo" style={{ width: 28, height: 28 }} />
        </a>
      </div>
    </div>
  )
}