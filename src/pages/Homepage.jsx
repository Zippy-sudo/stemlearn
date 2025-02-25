import React from 'react'
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import CourseList from '../components/CourseList';
import Footer from '../components/Footer';

function Homepage() {
    return (
        <div className='routes'>
            <HeroSection />
            <Features />
            <CourseList />
            <Footer />
        </div>
    );
}

export default Homepage;
