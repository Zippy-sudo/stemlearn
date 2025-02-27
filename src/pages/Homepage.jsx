import React  from 'react'

import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import CourseList from '../components/CourseList';
import Footer from '../components/Footer';

function Homepage({loggedIn, baseURL}) {
    return (
        <div className='routes'>
            <HeroSection />
            <Features />
            <CourseList loggedIn={loggedIn} baseURL={baseURL}/>
            <Footer />
        </div>
    );
}

export default Homepage;
