import React from 'react'
import { BrowserRouter as Router} from 'react-router-dom'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import CourseCard from '../components/CourseCard';
import Footer from '../components/Footer';
  
    
function Homepage() {
    return (
        <Router>
            <div className='routes'>
                <Navbar />
                <HeroSection/>
                <Features />
                <CourseCard />
                <Footer />
            </div>
        </Router>
      )
}

export default Homepage