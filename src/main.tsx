import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { hasViewTransitionApi, syncMotionPreferenceFromUrl } from './lib/view-transitions'

syncMotionPreferenceFromUrl()
const supportsViewTransitionApi = hasViewTransitionApi()
document.documentElement.classList.toggle('has-view-transition-api', supportsViewTransitionApi)
document.documentElement.classList.toggle('no-view-transition-api', !supportsViewTransitionApi)

createRoot(document.getElementById('root')!).render(<App />)
