import React, { useState, useEffect, useCallback, useRef } from "react";
import './projects.css'

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

// Small inline icons so we don't depend on any icon library
function ChevronDownIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function CheckIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowUpRightIcon({ className = "" }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

/*
  SIMPLE PORTFOLIO FILTER TEMPLATE — OPTIMIZED MEDIA EDITION
  ------------------------------------------------------------
  What changed from the original, and why:

  1. GIFs are replaced with <video> (MP4 + optional WebM).
     GIFs are one of the worst formats for the web: no real
     compression, no lazy-decoding, often 5-20x larger than an
     equivalent looping video. An <video autoPlay loop muted
     playsInline> tag LOOKS identical to a GIF but streams and
     decodes far more efficiently, especially on low-power CPUs.

  2. Still images are WebP only — no PNG/JPG fallback file is
     referenced anymore. WebP has broad support in every modern
     browser, so we skip the extra fallback asset and just point
     <img> straight at the .webp file.

  3. Image frames now have a transparent background and use
     object-fit: "contain" instead of "cover" — the whole image
     renders uncropped, with no colored box showing behind it.
     Video frames keep object-fit: "cover" and their placeholder
     background so looping clips still fill the frame cleanly.

  4. Everything below the fold is lazy-loaded via
     IntersectionObserver (LazyMedia component) instead of
     loading all 10 project cards' media on first paint.
     Native `loading="lazy"` is also set as a belt-and-suspenders
     fallback for images.

  5. Explicit width/height (via aspect-ratio) are reserved for
     every media slot so the browser never has to reflow content
     as media loads in — this avoids layout shift (CLS) and keeps
     every card the same height, so the grid stays aligned even
     though images are no longer cropped to fill the frame.

  HOW TO SUPPLY YOUR MEDIA ONCE YOU HAVE IT OPTIMIZED:
  ------------------------------------------------------------
  For each project, instead of a single `image` string, pass a
  `media` object:

    // For a looping clip (was a GIF):
    media={{
      type: "video",
      mp4: "/images/beat_saber_demo.mp4",
      webm: "/images/beat_saber_demo.webm", // optional but recommended
      poster: "/images/beat_saber_demo-poster.jpg", // first-frame still
    }}

    // For a static image:
    media={{
      type: "image",
      webp: "/images/raytracer_img1.webp",
      alt: "Raytracer render of a glass sphere",
    }}

  Recommended conversion commands (run once you have the raw files,
  requires ffmpeg + cwebp installed locally):

    # GIF -> MP4 (silent, small, high quality)
    ffmpeg -i input.gif -movflags faststart -pix_fmt yuv420p \
      -vf "scale=800:-2" -c:v libx264 -crf 23 output.mp4

    # GIF -> WebM (even smaller, good browser support)
    ffmpeg -i input.gif -vf "scale=800:-2" -c:v libvpx-vp9 \
      -b:v 0 -crf 30 output.webm

    # Grab a poster frame from the video (shows before it plays)
    ffmpeg -i output.mp4 -frames:v 1 -q:v 2 output-poster.jpg

    # PNG/JPG -> WebP
    cwebp -q 80 input.png -o output.webp

  Since the card only ever displays media at ~400px wide by 200px
  tall, there's no reason to ship anything wider than ~800px
  (2x for retina) — resize before uploading; it's the single
  biggest file-size win available.
*/

// 1. Define your filters here. Add as many as you want.
const FILTERS = [
  { id: "animation", label: "Animation", color: "#4438a0" },
  { id: "scripting", label: "Tool Projects", color: "#00ccff" },
  { id: "technical_art", label: "Technical Art", color: "#e1ff00" },
  { id: "computer_graphics", label: "Computer Graphics", color: "#118613" },
  { id: "game_dev", label: "Game Development", color: "#898989" },
  { id: "cad", label: "CAD", color: "#ff9100" },
  { id: "electronics", label: "Electronics", color: "#009999" },
];

function getFilterColor(id) {
  return FILTERS.find((f) => f.id === id)?.color ?? "#9CA3AF";
}

const QUERY_PARAM = "filters";

// --- URL <-> state helpers -------------------------------------------------

function getFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get(QUERY_PARAM);
  if (!raw) return [];
  const validIds = new Set(FILTERS.map((f) => f.id));
  return raw.split(",").filter((id) => validIds.has(id));
}

function setFiltersInURL(activeIds) {
  const params = new URLSearchParams(window.location.search);
  if (activeIds.length > 0) {
    params.set(QUERY_PARAM, activeIds.join(","));
  } else {
    params.delete(QUERY_PARAM);
  }
  const newSearch = params.toString();
  const newURL =
    window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
  window.history.replaceState({}, "", newURL);
}

// --- Filter dropdown ---------------------------------------------------

function FilterDropdown({ activeIds, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        id="filter-button"
        className="action-button"
        onClick={() => setOpen((o) => !o)}
      >
        Show Filters
        <ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div>
          {FILTERS.map((filter) => {
            const checked = activeIds.includes(filter.id);
            return (
              <label
                key={filter.id}
                className="flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer text-sm text-gray-700"
                style={{
                  border: `2px solid ${filter.color}`,
                  backgroundColor: checked ? `${filter.color}1A` : "transparent",
                  marginBottom: "10px",
                }}
              >
                <span
                  className="flex items-center justify-center w-4 h-4 rounded border"
                  style={{
                    backgroundColor: checked ? filter.color : "transparent",
                    borderColor: filter.color,
                  }}
                >
                  {checked && <CheckIcon className="text-white" />}
                </span>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checked}
                  onChange={() => onToggle(filter.id)}
                />
                {filter.label}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- Wrapper that shows/hides its children based on active filters ---------

function FilterableItem({ tags = [], activeIds, children }) {
  const visible = activeIds.length === 0 || tags.some((tag) => activeIds.includes(tag));
  if (!visible) return null;

  return <>{children}</>;
}

// --- LazyMedia: only mounts real media once it's near the viewport ---------
// This is what makes low-power devices happy: a card 8 rows down never
// even requests its video/image bytes until the user scrolls near it.

function useInView(options) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If IntersectionObserver isn't available for some reason, just show it.
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.disconnect(); // only need to trigger once
      }
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
  }, [options]);

  return [ref, inView];
}

function LazyMedia({ media, title }) {
  const [ref, inView] = useInView({ rootMargin: "400px 0px" });
  const isImage = media?.type === "image";

  return (
    <div
      ref={ref}
      className="media-frame"
      style={{
        width: "100%",
        aspectRatio: "2 / 1",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        overflow: "hidden",
      }}
    >
      {inView && media?.type === "video" && (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={media.poster}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        >
          {media.webm && (
            <source src={media.webm} type="video/webm" />
          )}
          {media.mp4 && (
            <source src={media.mp4} type="video/mp4" />
          )}
        </video>
      )}

      {inView && isImage && (
        <img
          src={media.webp}
          alt={media.alt || title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      )}

      {!inView && media?.poster && (
        <img
          src={media.poster}
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      )}
    </div>
  );
}

// --- Example content component ----------------------------------------

function ProjectCard({ title, description, tags, media, date, software, link, linkText = "Learn more" }) {
  return (
    <div
      className="p-5 rounded-xl border border-gray-200 bg-white"
      style={{ textAlign: "left" }}
    >
      <h3 className="font-semibold text-gray-900" style={{ textAlign: "left" }}>
        {title}
      </h3>
      {date && (
        <p className="text-xs text-gray-400 mt-0" style={{ textAlign: "left" }}>
          {date}
        </p>
      )}

      <LazyMedia media={media} title={title} />

      <div className="flex flex-wrap gap-5">
        {tags.map((tag) => {
          const color = getFilterColor(tag);
          return (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded font-medium"
              style={{
                border: `2px solid ${color}`,
                color: color,
                backgroundColor: `${color}1A`,
              }}
            >
              {FILTERS.find((f) => f.id === tag)?.label ?? tag}
            </span>
          );
        })}
      </div>
      <p className="text-sm text-gray-600 mt-3" style={{ textAlign: "left" }}>
        {description}
      </p>
      {software && (
        <p
          style={{ fontSize: "16px", fontWeight: "bold", textAlign: "left" }}
          className="text-gray-400 mt-1"
        >
          {software}
        </p>
      )}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="action-button learn-more-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginTop: "14px",
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          {linkText}
          <ArrowUpRightIcon />
        </a>
      )}
    </div>
  );
}

// --- App -----------------------------------------------------------------

export default function App() {
  const [activeIds, setActiveIds] = useState(() => getFiltersFromURL());

  useEffect(() => {
    setFiltersInURL(activeIds);
  }, [activeIds]);

  useEffect(() => {
    const onPopState = () => setActiveIds(getFiltersFromURL());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const toggleFilter = useCallback((id) => {
    setActiveIds((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  return (
    <div className="projects-container">
      <FilterDropdown activeIds={activeIds} onToggle={toggleFilter} />
      <div className="project-grid">
        <FilterableItem tags={["game_dev", "cad", "electronics"]} activeIds={activeIds}>
          <ProjectCard
            title="Beat Saber Controller"
            description="Designed and 3D-printed custom wireless motion controllers to play a custom version of the Beat Saber video game."
            tags={["game_dev", "cad", "electronics"]}
            date="May 2026 - Aug 2026"
            software="Unity, Blender, Arduino, ESP32"
            media={{
              type: "video",
              webm: asset("images/beat_saber.webm"),
              poster: asset("images/beat_saber.jpg"),
            }}
            link="https://github.com/skyha27/beat-saber-game"
            linkText="Github"
          />
        </FilterableItem>

        <FilterableItem tags={["computer_graphics", "technical_art"]} activeIds={activeIds}>
          <ProjectCard
            title="Mesh Slicer"
            description="Implemented a real-time Unity mesh slicing system that operates on triangulated geometry."
            tags={["computer_graphics", "technical_art"]}
            date="May 2026 - Aug 2026"
            software="Unity, C#"
            media={{
              type: "video",
              webm: asset("images/mesh_slicer.webm"),
              poster: asset("images/mesh_slicer_demo-poster.jpg"),
            }}
            link="https://github.com/skyha27/mesh-slicer-2026-05-23_11-52-17"
            linkText="Github"
          />
        </FilterableItem>

        <FilterableItem tags={["scripting"]} activeIds={activeIds}>
          <ProjectCard
            title="Maya Render Queue Tool"
            description="Python-based rendering and shot-automation tool with dynamic queueing features."
            tags={["scripting"]}
            date="Dec 2025"
            software="Maya, Python"
            media={{
              type: "image",
              webp: "/images/maya_project.webp",
              alt: "Maya Render Queue Tool UI",
            }}
            link="https://github.com/skyha27/Maya-Render-Queue-Tool"
            linkText="Github"
          />
        </FilterableItem>

        <FilterableItem tags={["animation"]} activeIds={activeIds}>
          <ProjectCard
            title="Pull U Once, Shame on Me"
            description="Student film. Worked on rigging, debugging, and character animation."
            tags={["animation"]}
            date="Sep 2025 - Dec 2025"
            software="Maya"
            media={{
              type: "image",
              webp: "/images/pull_u_img.webp",
              alt: "Still from Pull U Once, Shame on Me",
            }}
            link="https://vimeo.com/1149354401?share=copy&fl=cl&fe=ci"
            linkText="Watch here"
          />
        </FilterableItem>

        <FilterableItem tags={["computer_graphics", "technical_art"]} activeIds={activeIds}>
          <ProjectCard
            title="Fire Particle System"
            description="OpenGL implementation of a fire particle system including heat transfer dynamics."
            tags={["computer_graphics", "technical_art"]}
            date="Nov 2025 - Dec 2025"
            software="C++, OpenGL, GLSL"
            media={{
              type: "video",
              webm: asset("images/fire_sim.webm"),
              poster: asset("images/fire_sim_demo-poster.jpg"),
            }}
          />
        </FilterableItem>

        <FilterableItem tags={["computer_graphics"]} activeIds={activeIds}>
          <ProjectCard
            title="C++ Raytracer"
            description="Built a multithreaded C++ raytracer supporting triangulated mesh, primitive shapes, Phong illumination, recursive reflections, and anti-aliasing."
            tags={["computer_graphics"]}
            date="Sept 2025 - Nov 2025"
            software="C++"
            media={{
              type: "image",
              webp: "/images/raytracer.webp",
              alt: "C++ raytracer render",
            }}
          />
        </FilterableItem>

        <FilterableItem tags={["computer_graphics"]} activeIds={activeIds}>
          <ProjectCard
            title="Brush Drawing Application"
            description="Raster drawing application built for a Computer Graphics course, featuring constant, linear, quadratic, and smudge brushes."
            tags={["computer_graphics"]}
            date="Sept 2025"
            software="C++, Qt"
            media={{
              type: "image",
              webp: "/images/raster_img.webp",
              alt: "Brush drawing application screenshot",
            }}
          />
        </FilterableItem>

        <FilterableItem tags={["scripting"]} activeIds={activeIds}>
          <ProjectCard
            title="Blender Shot Recovery Script"
            description="Scripting tool to automate viewport screenshoting to recover animation from corrupted files."
            tags={["scripting"]}
            date="June 2025 - July 2025"
            software="Blender, Python"
            media={{
              type: "image",
              webp: "/images/blender-shot-fix.webp",
              alt: "Blender Shot Recovery Script screenshot",
            }}
            link="https://github.com/skyha27/Blender-Shot-Recovery-Script"
            linkText="Github"
          />
        </FilterableItem>

        <FilterableItem tags={["animation"]} activeIds={activeIds}>
          <ProjectCard
            title="Sit Next to Me"
            description="Animated music video. Involved in animation, shading, lighting, and scripting."
            tags={["animation"]}
            date="June 2025 - July 2025"
            software="Blender"
            media={{
              type: "image",
              webp: "/images/sit_next_to_me.webp",
              alt: "Still from Sit Next to Me animated music video",
            }}
            link="https://drive.google.com/file/d/1CEiN2C0LG0xa2RYXYPv8W8rDDeXRxk3a/view?usp=sharing"
            linkText="Watch here"
          />
        </FilterableItem>

        <FilterableItem tags={["game_dev"]} activeIds={activeIds}>
          <ProjectCard
            title="Briknite"
            description="Online multiplayer video game. Worked on player and gameplay scripts in addition to creating custom player animations."
            tags={["game_dev"]}
            date="Aug 2024 - Dec 2024"
            software="Unity, C#, Blender"
            media={{
              type: "image",
              webp: "/images/briknite.webp",
              alt: "Briknite gameplay screenshot",
            }}
          />
        </FilterableItem>

      </div>
    </div>
  );
}