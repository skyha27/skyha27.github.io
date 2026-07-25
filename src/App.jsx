import React, { useState, useEffect, useCallback } from "react";

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
*/

// 1. Define your filters here. Add as many as you want.
// `color` can be any hex value — it's used for the checkbox rectangle
// and the matching tag shown on project cards.
const FILTERS = [
  { id: "frontend", label: "Frontend", color: "#3B82F6" },
  { id: "backend", label: "Backend", color: "#10B981" },
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
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Show Filters
        <ChevronDownIcon className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg p-2">
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
  return <div>{children}</div>;
}

// --- Example content component ----------------------------------------

function ProjectCard({ title, description, tags, image }) {
  return (
    <div className="p-5 rounded-xl border border-gray-200 bg-white">
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <img
        src={image || "https://placehold.co/400x200?text=Project+GIF"}
        alt={title}
        className="w-full rounded-lg mt-2 mb-2 object-cover"
      />
      <div className="flex flex-wrap gap-3">
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
      <p className="text-sm text-gray-600 mt-3">{description}</p>
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">My Projects</h1>
          <FilterDropdown activeIds={activeIds} onToggle={toggleFilter} />
        </div>

        <div className="grid gap-4">
          <FilterableItem tags={["frontend"]} activeIds={activeIds}>
            <ProjectCard
              title="Portfolio Site"
              description="This very site — React + URL-driven filters."
              tags={["frontend"]}
            />
          </FilterableItem>

          <FilterableItem tags={["backend"]} activeIds={activeIds}>
            <ProjectCard
              title="API Service"
              description="A REST API built for a class project."
              tags={["backend"]}
            />
          </FilterableItem>

          <FilterableItem tags={["frontend", "backend"]} activeIds={activeIds}>
            <ProjectCard
              title="Full-Stack App"
              description="Something that touches both ends of the stack."
              tags={["frontend", "backend"]}
            />
          </FilterableItem>
        </div>
      </div>
    </div>
  );
}