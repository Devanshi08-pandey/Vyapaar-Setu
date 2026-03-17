import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import VendorDashboard from './pages/VendorDashboard';
import AiSupportBot from './components/AiSupportBot';

function App() {
  return (
    <Router>
      <AiSupportBot />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/explore" element={<Marketplace />} />
        <Route path="/dashboard" element={<VendorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
