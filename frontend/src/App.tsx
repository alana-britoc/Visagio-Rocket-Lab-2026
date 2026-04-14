import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Catalogo from './pages/Catalogo'
import ProdutoDetalhePage from './pages/ProdutoDetalhe'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/produtos/:id" element={<ProdutoDetalhePage />} />
      </Routes>
    </BrowserRouter>
  )
}