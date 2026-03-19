import React, { useEffect, useState } from 'react';
import { Users, Activity, CheckCircle, Clock } from 'lucide-react';
import { getAllUsers } from '../services/userService';
import { getAllRoutines } from '../services/routineService';
import { getAllExercises } from '../services/exerciseService';


const DashboardAdministrador = ({ changeTab }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRoutines: 0,
        pendingRoutines: 0,
        approvedRoutines: 0,
        totalExercises: 0
    });

    useEffect(() => {
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

        fetchStats();
    }, []);

    return (
        <div className="dashboard-overview animate-fade-in">
            <div className="dashboard-header">
                <h1>Overview</h1>
                <p>Resumen general de la plataforma</p>
            </div>

            <div className="overview-grid">
                <div className="widget-card" onClick={() => changeTab('users')} style={{ cursor: 'pointer' }}>
                    <div className="widget-icon blue">
                        <Users size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Usuarios Totales</h3>
                        <p>{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="widget-card" onClick={() => changeTab('routines')} style={{ cursor: 'pointer' }}>
                    <div className="widget-icon orange">
                        <Clock size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Rutinas Pendientes</h3>
                        <p>{stats.pendingRoutines}</p>
                    </div>
                </div>

                <div className="widget-card" onClick={() => changeTab('routines')} style={{ cursor: 'pointer' }}>
                    <div className="widget-icon green">
                        <CheckCircle size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Rutinas Aprobadas</h3>
                        <p>{stats.approvedRoutines}</p>
                    </div>
                </div>

                <div className="widget-card" onClick={() => changeTab('exercises')} style={{ cursor: 'pointer' }}>
                    <div className="widget-icon" style={{ backgroundColor: 'rgba(139, 0, 0, 0.1)', color: '#8b0000' }}>
                        <Activity size={28} />
                    </div>
                    <div className="widget-info">
                        <h3>Ejercicios en Biblioteca</h3>
                        <p>{stats.totalExercises}</p>
                    </div>
                </div>

                <div className="widget-card" onClick={() => changeTab('routines')} style={{ cursor: 'pointer' }}>
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
