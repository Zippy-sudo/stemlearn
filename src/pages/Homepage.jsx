import React  from 'react'

import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import CourseList from '../components/CourseList';
import Footer from '../components/Footer';

function Homepage({loggedIn, baseURL}) {
    return (
        <div className='flex justify-center pt-4'>
        <div className='routes max-w-[1200px]'>
            <HeroSection />
            <Features />
            <CourseList loggedIn={loggedIn} baseURL={baseURL}/>
            <Footer />
        </div>
        </div>
    );
}

export default Homepage;
