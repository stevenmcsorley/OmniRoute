// src/App.tsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Employees from './components/Employees';
import ResourcesAdmin from './components/ResourcesAdmin';
import AssignmentsAdmin from './components/AssignmentsAdmin';
import ReservationsAdmin from './components/ReservationsAdmin';
import NotFound from './components/NotFound';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/">Dashboard</Link> | 
          <Link to="/employees">Employees</Link> | 
          <Link to="/resources">Resources</Link> |
          <Link to="/assignments">Assignments</Link> |
          <Link to="/reservations">Reservations</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/resources" element={<ResourcesAdmin />} />
          <Route path="/assignments" element={<AssignmentsAdmin />} />
          <Route path="/reservations" element={<ReservationsAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
