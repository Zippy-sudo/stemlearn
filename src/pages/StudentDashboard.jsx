import React, { useEffect, useState, useRef} from 'react';
import { Link, useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
import StudentSidebar from '../components/StudentSidebar';
import biology from "../images/Biology.jpg"
import compsci from "../images/CompSci.jpeg"
import engineering from "../images/Engineering.png"
import math from "../images/Math.jpg"
import physics from "../images/Physics.jpg"
import science from "../images/Science.jpg"

function StudentDashboard({baseURL, loggedIn, setLoggedIn}) {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true)
    const [studentName, setStudentName] = useState("")
    const token = sessionStorage.getItem('Token'); // Assuming the token is stored in sessionStorage
    const navigate = useNavigate()
    const sessionTimeout = useRef(null)

    useEffect(() => {
        // Fetch enrolled courses
        async function fetchMyCourses() {
            try {
                const response = await fetch(`${baseURL}/enrollments`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setEnrollments(data);
                    setLoading(false)
                    let capname = ""
                    for (const word of data[0].student.name.split(" ")) 
                        {capname += (word).slice(0,1).toUpperCase() + word.slice(1).toLowerCase() + " "}
                    setStudentName(capname)
                } else {
                  console.error('Failed to fetch courses:', data.Error);
                  setLoggedIn(false)
                  sessionStorage.removeItem("Token")
                  sessionStorage.removeItem("Role")
                  navigate("/Login")
                  window.location.reload()
                  toast.info("Session expired. Please login to continue.",{
                  position: "top-center",
                  autoClose: false,
                  closeButton: true,
                  }
                  )
                }
            } catch (error) {
                console.error(`Failed to fetch courses:`, error);
            }
        }

        fetchMyCourses();
    }, [token, baseURL]);

    return (
        loggedIn ? 
          <div className='flex relative'>
          <StudentSidebar studentName={studentName} baseURL={baseURL} />
          <div className='min-w-80'></div>
          <div id="my-courses-section" className='flex-grow mt-20 items-center'>
            <div className='text-center mt-4 pt-4 pb-4 bg-main-yellow mx-4'>
              <h2 className='text-xl'>My Courses</h2>
            </div>

            {loading ? <p>Loading Enrollments...</p> :
            (enrollments.length > 0 ? (
              <ul>
                {enrollments.map((enrollment) => {
                  return (
                    <li key={enrollment._id} className='flex flex-col items-center bg-white text-center m-4 p-2'>
                      <div className='flex flex-col bg-white m-2 items-center justify-center'>
                        <div className='h-[250px] w-[500px]'>
                          {enrollment.course.subject === "Mathematics" ? (
                            <img src={math} alt="math" title="Math" className="w-full h-full object-cover" />
                          ) : enrollment.course.subject === "Physics" ? (
                            <img src={physics} alt="physics" title="Physics" className="w-full h-full object-cover" />
                          ) : enrollment.course.subject === "Biology" ? (
                            <img src={biology} alt="biology" title="Biology" className="w-full h-full object-cover" />
                          ) : enrollment.course.subject === "Computer Science" ? (
                            <img src={compsci} alt="computer science" title="Computer Science" className="w-full h-full object-cover" />
                          ) : enrollment.course.subject === "Engineering" ? (
                            <img src={engineering} alt="engineering" title="Engineering" className="w-full h-full object-cover" />
                          ) : (
                            <img src={science} alt="generic science" title="Generic" className="w-full h-full object-cover" />
                          )}
                        </div>
                      </div>
      
                      <div className='w-[250px] m-5'>
                        <h3>{enrollment.course.title}</h3>
                        <p>{enrollment.course.description}</p>
                        <p><strong>Subject:</strong> {enrollment.course.subject}</p>
                        <p><strong>Duration:</strong> {enrollment.course.duration} Years</p>
                        <p><strong>Enrolled On:</strong> {enrollment.enrolled_on}</p>
                        <p><strong>Completion:</strong> {enrollment.progresses.length > 0 ? `${Math.round((enrollment.progresses.length / enrollment.course.lessons.length) * 100)} %` : "0%"}</p>
                        <Link to={`/Lessons/${enrollment.course._id}`}>
                          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Go to Lessons
                          </button>
                        </Link>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>You are not enrolled in any courses.</p>
            ))}
          </div>
        </div>:
        null
      );
}

export default StudentDashboard;