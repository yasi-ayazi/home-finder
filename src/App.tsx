import './App.css'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer';
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Buy from './pages/Buy';

function App() {

  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buy" element={<Buy />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App
