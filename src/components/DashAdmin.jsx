import React, { useState } from 'react';
import { LayoutDashboard, Users, Activity, Home, Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardAdministrador from './DashboardAdministrador';
import AdminUsers from './AdminUsers';
import AdminRoutines from './AdminRoutines';
import AdminExercises from './AdminExercises';
import '../Styles/dashboard.css';

const DashAdmin = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardAdministrador changeTab={setActiveTab} />;
      case 'users':
        return <AdminUsers />;
      case 'routines':
        return <AdminRoutines />;
      case 'exercises':
        return <AdminExercises />;
      default:
        return <DashboardAdministrador changeTab={setActiveTab} />;
    }
  };

  return (
    <div className="admin-dashboard">
      <aside className="admin-sidebar" style={{ zIndex: 1000 }}>
        <h2>Admin Panel</h2>
        <nav className="sidebar-nav">
          <button 
            className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <LayoutDashboard size={20} />
            Overview
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={20} />
            Usuarios
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'routines' ? 'active' : ''}`}
            onClick={() => setActiveTab('routines')}
          >
            <Activity size={20} />
            Rutinas
          </button>
          <button 
            className={`sidebar-btn ${activeTab === 'exercises' ? 'active' : ''}`}
            onClick={() => setActiveTab('exercises')}
          >
            <Dumbbell size={20} />
            Ejercicios
          </button>
          <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px solid #e9edff' }} />
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="sidebar-btn">
              <Home size={20} />
              Volver a Inicio
            </button>
          </Link>
        </nav>
      </aside>

      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default DashAdmin;
