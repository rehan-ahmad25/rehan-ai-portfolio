import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Note on bundle size: the three.js/@react-three/fiber chunk (the Hero's
// neural-graph scene) is the one deliberately large piece of this bundle
// (~210KB gzipped). It's an accepted trade-off, not an oversight — it's
// already code-split into its own chunk via React.lazy(), only fetched
// once the Hero mounts, paused via IntersectionObserver when scrolled out
// of view, and skipped entirely for prefers-reduced-motion visitors. There
// isn't a meaningfully smaller way to keep a real WebGL scene without
// dropping the tech (in which case a lighter CSS/canvas alternative would
// be the honest fix, not further micro-optimizing this chunk).
export default defineConfig({
  plugins: [react()],
})
