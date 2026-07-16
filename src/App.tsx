import './App.css'
import Header from './components/Header/Header'
import Hero from "./components/Hero/Hero";
import Services from './components/Services/Services';
import FeaturedProperties from './components/FeaturedProperties/FeaturedProperties';
import Footer from './components/Footer/Footer';

function App() {

  return (
    <>
      <Hero />
      <Header />
      <Services />
      <FeaturedProperties />
      <Footer />
    </>
  )
}

export default App
