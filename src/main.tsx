import { createRoot } from 'react-dom/client'
import '@fontsource/space-grotesk/latin-300.css'
import '@fontsource/space-grotesk/latin-400.css'
import '@fontsource/space-grotesk/latin-500.css'
import '@fontsource/space-grotesk/latin-700.css'
import '@fontsource/jetbrains-mono/latin-300.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'
import '@fontsource/jetbrains-mono/latin-700.css'
import './index.css'
import App from './App.tsx'
import { hasViewTransitionApi, syncMotionPreferenceFromUrl } from './lib/view-transitions'

syncMotionPreferenceFromUrl()
const supportsViewTransitionApi = hasViewTransitionApi()
document.documentElement.classList.toggle('has-view-transition-api', supportsViewTransitionApi)
document.documentElement.classList.toggle('no-view-transition-api', !supportsViewTransitionApi)

createRoot(document.getElementById('root')!).render(<App />)
