import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PropertyDetails from './pages/PropertyDetails';
import Dashboard from './pages/Dashboard';
import EditProperty from './pages/EditProperty';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="flex-grow-1 d-flex flex-column">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/edit-property/:id" element={<EditProperty />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
    </ThemeProvider>
  );
}

export default App;
