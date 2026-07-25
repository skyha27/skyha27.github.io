import React from "react";

// Template image data — swap the `src` values for your real artwork.
// Using picsum.photos as placeholders, seeded so they stay consistent.
const sketches = [
  { id: "s1", src: "https://picsum.photos/seed/sketch1/400/300", alt: "Sketch 1" },
  { id: "s2", src: "https://picsum.photos/seed/sketch2/400/300", alt: "Sketch 2" },
  { id: "s3", src: "https://picsum.photos/seed/sketch3/400/300", alt: "Sketch 3" },
  { id: "s4", src: "https://picsum.photos/seed/sketch4/400/300", alt: "Sketch 4" },
  { id: "s5", src: "https://picsum.photos/seed/sketch5/400/300", alt: "Sketch 5" },
  { id: "s6", src: "https://picsum.photos/seed/sketch6/400/300", alt: "Sketch 6" },
];

const digitalArt = [
  { id: "d1", src: "https://picsum.photos/seed/digital1/400/300", alt: "Digital art 1" },
  { id: "d2", src: "https://picsum.photos/seed/digital2/400/300", alt: "Digital art 2" },
  { id: "d3", src: "https://picsum.photos/seed/digital3/400/300", alt: "Digital art 3" },
  { id: "d4", src: "https://picsum.photos/seed/digital4/400/300", alt: "Digital art 4" },
  { id: "d5", src: "https://picsum.photos/seed/digital5/400/300", alt: "Digital art 5" },
];

const GAP = 20;
const ROW_HEIGHT = 220;

function GallerySection({ title, images }) {
  return (
    <section style={{ marginBottom: 56 }}>
      <h2
        style={{
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "#6b6b6b",
          marginBottom: 16,
          paddingBottom: 10,
          borderBottom: "1px solid #e3e3e3",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: GAP,
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            style={{
              height: ROW_HEIGHT,
              flex: "1 1 auto",
              minWidth: 160,
              maxWidth: 340,
              borderRadius: 8,
              overflow: "hidden",
              backgroundColor: "#f0f0f0",
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Portfolio() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
      <GallerySection title="Sketches" images={sketches} />
      <GallerySection title="Digital Art" images={digitalArt} />
    </div>
  );
}