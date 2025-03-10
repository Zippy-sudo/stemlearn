import React, { useEffect, useState } from 'react';
import biology from "../images/Biology.jpg"
import compsci from "../images/CompSci.jpeg"
import engineering from "../images/Engineering.png"
import math from "../images/Math.jpg"
import physics from "../images/Physics.jpg"
import science from "../images/Science.jpg"

const CertificatesPage = ({ studentId, baseURL }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch certificates from the backend
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${baseURL}/certificates/${studentId}`);
        const data = await response.json();
        setCertificates(data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [studentId]);

  if (loading) {
    return <p className="text-center text-gray-600">Loading certificates...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">My Certificates</h1>
      <p className="text-lg text-gray-600 mb-8">
        You have earned <span className="font-semibold">{certificates.length} Certificates</span>.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <div key={index} className="flex bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            {cert.enrollment.course.subject === "Mathematics" ?
                            <img src={math} alt="math" title="Math"/>:
                             enrollment.course.subject === "Physics" ?
                            <img src={physics} alt="physics" title="Physics"/>:
                             enrollment.course.subject === "Biology" ?
                            <img src={biology} alt="biology" title="Biology"/>:
                             enrollment.course.subject === "Computer Science" ? 
                            <img src={compsci} alt="computer science" title="Computer Science"/>:
                             enrollment.course.subject === "Engineering" ?
                            <img src={engineering} alt="engineering" title="Engineering"/>:
                            <img src={science} alt="generic science" title="Generic"/>
            }
            <h2 className="text-xl font-bold mb-2">{cert.enrollment.course.title}</h2>
            <p className="text-gray-600 mb-4">{cert.enrollment.course.description}</p>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Completion:</span> {cert.enrollment.completion_percentage}%
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Issued on:</span> {cert.issued_on}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Enrolled on:</span> {cert.enrollment.enrolled_on}
              </p>
            </div>
            <a
              href={cert.certificate_url} // Replace with the actual certificate URL if available
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Your Certificate 
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificatesPage;
