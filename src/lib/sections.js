// Section anchor IDs for the home page, shared between Home.jsx (which
// scroll-targets them) and Navbar.jsx (which observes them for the
// active-link highlight). Kept in its own module so Home.jsx can stay a
// component-only export (mixing constant + component exports in one file
// breaks React Fast Refresh).
export const HOME_SECTIONS = [
  "top",
  "about",
  "skills",
  "work",
  "experience",
  "blogs",
  "contact",
];
