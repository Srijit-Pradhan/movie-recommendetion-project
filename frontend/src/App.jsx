// Step 1: React Router er dorkari jinish gulo import korchi
import { Routes, Route } from "react-router-dom";

// Step 2: Pura app er page gulo import korchi
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import AdminDashboard from "./pages/AdminDashboard";
import PersonDetails from "./pages/PersonDetails";
import About from "./pages/About";

// Step 3: Navbar ar Footer import korchi (jara shob page e thakbe)
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

/**
 * Main App Component
 * Ei component ta amader pura website er structure handle kore.
 */
function App() {
  return (
    <>
      {/* Navbar shob jaygay same thakbe */}
      <Navbar />

      {/* Step 4: Routes - URL change hole kon page dekhabe seta define kora ache */}
      <main className="container" style={{ minHeight: "85vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dynamic routes - specific movie ba person details dekhbar jonno */}
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/tv/:id" element={<MovieDetails />} />
          <Route path="/person/:id" element={<PersonDetails />} />

          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<Search />} />

          {/* Admin Dashboard with nested routes support (/*) */}
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Footer shob page er niche thakbe */}
      <Footer />
    </>
  );
}

export default App;
