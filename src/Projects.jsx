import React, { useState, useEffect, useCallback } from "react";
import './projects.css'

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
  SIMPLE PORTFOLIO FILTER TEMPLATE
  ---------------------------------
  How it works:
  1. FILTERS below defines the checkboxes in the dropdown. Add/remove entries
     to make the list expandable — nothing else needs to change.
  2. Active filter ids are synced to the URL as a comma-separated query param:
       yoursite.com/?filters=react,backend
     This means you can hyperlink a resume straight to a pre-filtered view,
     e.g. <a href="https://you.dev/?filters=backend">See backend work</a>
  3. Each piece of content is wrapped in <FilterableItem tags={[...]}>.
     An item shows if: no filters are active, OR it has at least one tag
     that matches an active filter.
  4. Swap out the sample cards in <App> for your own project components —
     just keep the tags prop matching ids from FILTERS.
  5. Give each ProjectCard a `link` prop (a real URL) to show a "Learn more"
     button. Cards without a `link` simply won't show the button.
*/

// 1. Define your filters here. Add as many as you want.
// `color` can be any hex value — it's used for the checkbox rectangle
// and the matching tag shown on project cards.
const FILTERS = [
  { id: "animation", label: "Animation", color: "#4438a0" },
  { id: "scripting", label: "Tool Projects", color: "#00ccff" },
  { id: "technical_art", label: "Technical Art", color: "#e1ff00" },
  { id: "computer_graphics", label: "Computer Graphics", color: "#118613" },
  { id: "game_dev", label: "Game Development", color: "#898989" },
  { id: "cad", label: "CAD", color: "#ff9100" },
  { id: "electronics", label: "Electronics", color: "#009999" },
  // add more, e.g. { id: "ml", label: "Machine Learning", color: "#F59E0B" },
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
        onClick={() => setOpen((o) => !o)}      >
        Show Filters
        <ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
<div >          
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

// --- Example content component ----------------------------------------

function ProjectCard({ title, description, tags, image, date, software, link, linkText = "Learn more" }) {
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
          <img
      src={image || "https://placehold.co/400x200?text=Project+GIF"}
      alt={title}
      className="w-full rounded-lg mt-2 mb-2 object-cover"
      style={{ height: "200px" }}
    />
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

  // Keep the URL in sync whenever filters change
  useEffect(() => {
    setFiltersInURL(activeIds);
  }, [activeIds]);

  // Respond to back/forward navigation
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
              description="Designed and 3D-printed custom game controllers, integrating Arduino hardware with a Unity game."
              tags={["game_dev", "cad", "electronics"]}
              date="May 2026 - Present"
              software="Unity, Blender, Arduino"
            />
          </FilterableItem>

          <FilterableItem tags={["computer_graphics", "technical_art"]} activeIds={activeIds}>
            <ProjectCard
              title="Mesh Slicer"
              description="Implemented a real-time Unity mesh slicing system that operates on triangulated geometry."
              tags={["computer_graphics", "technical_art"]}
              date="May 2026 - Aug 2026"
              software="Unity, C#"
              image={"src/assets/Mesh Slicer Demo.gif"}
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
              image={"src/assets/Maya Render Queue UI.png"}
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
              image={"src/assets/pull_u_img.png"}
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
              image={"src/assets/Fire_Sim_Demo.gif"}
            />
          </FilterableItem>

          <FilterableItem tags={["computer_graphics"]} activeIds={activeIds}>
            <ProjectCard
              title="C++ Raytracer"
              description="Built a multithreaded C++ raytracer supporting triangulated mesh, primitive shapes, Phong illumination, recursive reflections, and anti-aliasing."
              tags={["computer_graphics"]}
              date="Sept 2025 - Nov 2025"
              software="C++"
              image={"src/assets/raytracer_img1.png"}
            />
          </FilterableItem>

          <FilterableItem tags={["computer_graphics"]} activeIds={activeIds}>
            <ProjectCard
              title="Brush Drawing Application"
              description="Raster drawing application built for a Computer Graphics course, featuring constant, linear, quadratic, and smudge brushes."
              tags={["computer_graphics"]}
              date="Sept 2025"
              software="C++, Qt"
              image={"src/assets/raster_img.png"}
              link="https://github.com/BrownCSCI1230/proj1-skyha27"
              linkText="Github"
            />
          </FilterableItem>

          <FilterableItem tags={["scripting"]} activeIds={activeIds}>
            <ProjectCard
              title="Blender Shot Recovery Script"
              description="Scripting tool to automate viewport screenshoting to recover animation from corrupted files."
              tags={["scripting"]}
              date="June 2025 - July 2025"
              software="Blender, Python"
              image={"src/assets/blender-shot-fix.png"}
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
              image={"src/assets/sit_next_to_me_drummer.png"}
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
              image={"src/assets/briknite_img1.jpeg"}
            />
          </FilterableItem>

          <FilterableItem tags={["electronics"]} activeIds={activeIds}>
            <ProjectCard
              title="Voice Controlled Nintendo Switch"
              description="Voice-controlled interface to play Super Smash Bros natively on a Nintendo Switch console."
              tags={["electronics"]}
              date="Dec 2023"
              software="Arduino, JavaScript"
              // image={"src/assets/briknite_img1.jpeg"}
              link="#"
              linkText="TODO: link -View the demo"
            />
          </FilterableItem>
        </div>
      </div>
  );
}