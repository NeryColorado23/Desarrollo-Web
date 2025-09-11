import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import DesarrolloWeb from './pages/DesarrolloWeb'
import RedesComputadoras from './pages/RedesComputadoras'
import InteligenciaArtificial from './pages/InteligenciaArtificial'
import SeguridadInformatica from './pages/SeguridadInformatica'

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/desarrollo-web" element={<DesarrolloWeb />} />
          <Route path="/redes-computadoras" element={<RedesComputadoras />} />
          <Route path="/inteligencia-artificial" element={<InteligenciaArtificial />} />
          <Route path="/seguridad-informatica" element={<SeguridadInformatica />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  )
}

export default App