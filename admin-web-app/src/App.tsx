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
// import AssignmentSubscription from './components/AssignmentSubscription';
import NotFound from './components/NotFound';
import './App.css';
import { store } from './store';
import ResourceList from './components/ResourceList';
import { Provider } from 'react-redux';

const App: React.FC = () => {
  return (
    <Provider store={store}>
    <Router>
      <div>
        <nav>
          <Link to="/">Dashboard</Link> | 
          <Link to="/employees">Employees</Link> | 
          <Link to="/resources">ResourceList</Link> |
          <Link to="/assignments">Assignments</Link> |
          <Link to="/reservations">Reservations</Link>
          {/* <Link to="/assignment-subscription">Assignment Subscription</Link> */}
        </nav>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/resources" element={<ResourceList />} />
          <Route path="/assignments" element={<AssignmentsAdmin />} />
          <Route path="/reservations" element={<ReservationsAdmin />} />
          {/* <Route path="/assignment-subscription" element={<AssignmentSubscription />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
    </Provider>
  );
};

export default App;
