const images = [
  { src: '/images/sketchbook/gesture_1.png', alt: 'Image 1' },
  { src: '/images/sketchbook/gesture_2.png', alt: 'Image 2' },
  { src: '/images/sketchbook/cartoon_king.png', alt: 'Image 3' },

  { src: '/images/sketchbook/axle_angry.png', alt: 'Image 4' },
  { src: '/images/sketchbook/psylocke.png', alt: 'Image 5' },
  { src: '/images/sketchbook/jubilee.png', alt: 'Image 6' },

  { src: '/images/sketchbook/rio_face.png', alt: 'Image 7' },
  { src: '/images/sketchbook/sweatshirt.png', alt: 'Image 8' },
]

export default function Portfolio() {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, padding: 20, justifyContent: 'space-between' }}>
      {images.map((img) => (
        <img key={img.src} src={img.src} alt={img.alt} style={{ height: 300, width: 'auto' }} />
      ))}
    </div>
  )
}