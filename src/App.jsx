import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import PlayerDetail from './pages/PlayerDetail.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/player/:id" element={<PlayerDetail />} />
      </Routes>
    </div>
  )
}
