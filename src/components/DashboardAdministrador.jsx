import React, { useEffect, useState } from 'react';
import { Users, Activity, CheckCircle, Clock, Plus } from 'lucide-react';
import { getAllUsers } from '../services/userService';
import { getAllRoutines } from '../services/routineService';
import { getAllExercises } from '../services/exerciseService';


const DashboardAdministrador = ({ changeTab, openAddModal }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRoutines: 0,
        pendingRoutines: 0,
        approvedRoutines: 0,
        totalExercises: 0
    });

    const fetchStats = async () => {
        try {
            const users = await getAllUsers();
            const routines = await getAllRoutines();
            const exercises = await getAllExercises();

            const pending = routines.filter(r => r.status === 'pending').length;
            const approved = routines.filter(r => r.status === 'approved').length;

            setStats({
                totalUsers: users.length,
                totalRoutines: routines.length,
                pendingRoutines: pending,
                approvedRoutines: approved,
                totalExercises: exercises.length
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    useEffect(() => {
        fetchStats();

        // Listen for new exercises added to refresh stats
        const handleRefresh = () => fetchStats();
        window.addEventListener('refreshExercises', handleRefresh);
        return () => window.removeEventListener('refreshExercises', handleRefresh);
    }, []);

    return (
        <div className="dashboard-overview animate-fade-in">
            <div className="dashboard-header">
                <h1>Overview</h1>
                <p>Resumen general de la plataforma</p>
            </div>

            <div className="overview-grid">
                <div className="widget-card animate-slide-up" onClick={() => changeTab('users')} style={{ cursor: 'pointer' }}>
                    <div className="widget-icon blue">
                        <Users size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Usuarios Totales</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="widget-card animate-slide-up" onClick={() => changeTab('routines')} style={{ cursor: 'pointer', animationDelay: '0.1s' }}>
                    <div className="widget-icon orange">
                        <Clock size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Rutinas Pendientes</h3>
                        <p>{stats.pendingRoutines}</p>
                    </div>
                </div>

                <div className="widget-card animate-slide-up" onClick={() => changeTab('routines')} style={{ cursor: 'pointer', animationDelay: '0.2s' }}>
                    <div className="widget-icon green">
                        <CheckCircle size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Rutinas Aprobadas</h3>
                        <p>{stats.approvedRoutines}</p>
                    </div>
                </div>

                <div className="widget-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="widget-icon" onClick={() => changeTab('exercises')} style={{ backgroundColor: 'rgba(139, 0, 0, 0.1)', color: '#8b0000', cursor: 'pointer' }}>
                        <Activity size={28} />
                    </div>
                    <div className="widget-info">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3>Biblioteca</h3>
                            <button 
                                className="add-shortcut-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openAddModal();
                                }}
                                title="Agregar Ejercicio"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <p onClick={() => changeTab('exercises')} style={{ cursor: 'pointer' }}>{stats.totalExercises} Ejercicios</p>
                    </div>
                </div>

                <div className="widget-card animate-slide-up" onClick={() => changeTab('routines')} style={{ cursor: 'pointer', animationDelay: '0.4s' }}>
                    <div className="widget-icon blue">
                        <Activity size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Todas las Rutinas</h3>
                        <p>{stats.totalRoutines}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdministrador;
