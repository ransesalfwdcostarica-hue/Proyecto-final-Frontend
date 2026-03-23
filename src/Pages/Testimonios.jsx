import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TestimonioComponent from '../components/TestimonioComponent';

/**
 * Testimonios Page
 * This page serves as a wrapper for the TestimonioComponent which contains
 * all the logic for the community stories, comments, and interactions.
 */
const Testimonios = () => {
    return (
        <TestimonioComponent />
    );
};

export default Testimonios;
