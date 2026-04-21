# Velour Chocolatier - React E-commerce Frontend

A luxurious, high-performance frontend for an artisan chocolate brand. Built with React and Vite. Features advanced scroll animations, custom cursors, a dynamic shopping cart, a sleek dark/light theme, and a responsive design tailored for mobile and desktop experiences.

## 🚀 Features
- **Frame-by-Frame Canvas Scroll Animation:** A high-fidelity sequence plays as the user scrolls down the hero section using a custom `<canvas>` layer.
- **Scroll-Triggered Fade-In Animations:** Driven by Intersection Observer API to smoothly reveal elements.
- **Global State Management:** A responsive Cart logic powered by standard React Context API.
- **Custom Animated Cursor & UI Flourishes:** An aesthetic cursor, marquee scrollbars, simple quick-view product modal, and smooth thematic transitions (Dark / Light mode).
- **Responsive Design:** Optimized CSS layout for Mobile, Tablet, and Desktop displays.

## 💻 How to Run Locally

To get a local copy up and running, follow these simple steps:

1. **Clone the repository** (if you haven't already):
   ```sh
   git clone <repository-url>
   ```
2. **Navigate to the core project directory:**
   ```sh
   cd "Projects/Minor Projects/Choclate"
   ```
3. **Install NPM Packages:**
   ```sh
   npm install
   ```
4. **Run the Development Server:**
   ```sh
   npm run dev
   ```
5. **Open your browser:** Visit `http://localhost:5173` (or the local port specified in your terminal) to view the project.

## 🤔 Decisions Worth Calling Out
- **Vanilla CSS with Variables vs Utility CSS (Tailwind):** Decided to use a global stylesheet (`index.css` & `App.css`) mapping to CSS variables (like `--clr-bg-dark`) over utility classes. This provides greater semantic clarity for specific theme-toggling (`data-theme="light"`) and makes managing complex, multi-state transitions cleaner.
- **Canvas for Video-Like Scroll Animations:** Used native `<canvas>` integrated with `requestAnimationFrame` drawing discrete images rather than parsing an actual video format. This guarantees butter-smooth frame scrubbing tied strictly to the scroll position without the stutters or buffering delays of video encoders.
- **Context API for Cart State:** Skipped heavy state libraries like Redux or Zustand. The e-commerce cart is localized, and React's built-in `createContext` was the perfect lightweight solution.
- **Native Browser APIs for Animation:** Used Intersection Observer and `requestAnimationFrame` over big bundles like GSAP or Locomotive Scroll, keeping the production build under a handful of kilobytes while retaining buttery smooth 60fps animations.

## 💡 What I Could Do Differently (With More Time)
- **Accessibility Improvements (a11y):** The custom cursor and custom overlay elements would benefit from stronger keyboard navigation bindings, screen reader labels, and tested contrast ratios for visually impaired users.
- **Image and Build Optimizations:** Implement lazy-loading via Vite plugins or `React.lazy` on heavy assets and non-critical views (like the Shop view or modals until they are toggled). Serving `.webp` or `.avif` over standard `.png` drops payload size tremendously.
- **Routing:** Implement a router like React Router for dedicated `/shop`, `/product/:id`, and `/checkout` views rather than toggling `currentView` in local state. It improves UX, enables history navigation, and unlocks deep-linking.
- **E-commerce Backend:** Connect to a headless CMS (like Sanity) or an e-commerce backend (like Shopify or Stripe) rather than hardcoded product data in `.js` files. Add actual payment gateways inside the Checkout Modal.
- **Automated Testing:** Introduce unit string sets (Vitest) and UI checks (React Testing Library) to guarantee cart functionality—adding variants, removing items, and total calculation math safely.
