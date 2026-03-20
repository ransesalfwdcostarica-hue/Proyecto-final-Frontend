import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestimonioComponent from '../components/TestimonioComponent';

const Testimonios = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    return <TestimonioComponent />;
};

export default Testimonios;
