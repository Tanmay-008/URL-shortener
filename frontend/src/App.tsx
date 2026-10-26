import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home'
import Expired from './pages/expired'
import RedirectHandler from './pages/redirect-handler'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/expired" element={<Expired />} />
        <Route path="/:shortCode" element={<RedirectHandler />} />
        <Route path="*" element={<Navigate to="/expired?reason=not_found" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
