// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import RoutesAdmin from './components/RoutesAdmin';
import Buses from './components/Buses';
import Bookings from './components/Bookings';
import NotFound from './components/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Dashboard</Link> | 
          <Link to="/users">Users</Link> | 
          <Link to="/routes">Routes</Link> |
          <Link to="/buses">Buses</Link> |
          <Link to="/bookings">Bookings</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/routes" element={<RoutesAdmin />} />
          <Route path="/buses" element={<Buses />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
