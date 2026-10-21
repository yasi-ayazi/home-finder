import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import PropertyDetails from "./pages/PropertyDetails";

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/buy" element={<Buy />} />
                <Route path="/property/:id" element={<PropertyDetails />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
