import React, { useState, useEffect, useCallback } from "react";
import { usePDF } from 'react-to-pdf';
import biology from "../images/Biology.jpg"
import compsci from "../images/CompSci.jpeg"
import engineering from "../images/Engineering.png"
import math from "../images/Math.jpg"
import physics from "../images/Physics.jpg"
import science from "../images/Science.jpg"

// Certificate Template Component
// Fetches the certificate, displays the date in a readable format
// Also displays the students name and course title
const CertificateTemplate = ({ certificate }) => {
  const formattedDate = certificate.issued_on ? new Date(certificate.issued_on).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : certificate.issued_on;

  return (
    <div className="w-[800px] h-[600px] bg-white border-4 border-yellow-500 p-8 relative">
      <div className="absolute inset-0 border-8 border-yellow-100 m-2"></div>
      <div className="absolute top-4 left-4 w-20 h-20 border-2 border-yellow-300 rounded-full opacity-20"></div>
      <div className="absolute bottom-4 right-4 w-20 h-20 border-2 border-yellow-300 rounded-full opacity-20"></div>
      {/* Certificate Header */}
      <div className="text-center mb-8 mt-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Certificate of Completion</h1>
        <div className="w-40 h-1 bg-yellow-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-600">This is to certify that</p>
      </div>

      {/* Student Name and the course details. Footer details */}
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-blue-600">{certificate.enrollment.student.name}</h2>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl text-gray-600">
          has successfully completed the course titled
        </p>
        <h3 className="text-3xl font-bold text-gray-800 mt-4">
          {certificate.enrollment.course.title}
        </h3>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl text-gray-600">
          on <span className="font-bold">{formattedDate}</span>
        </p>
      </div>

      <div className="text-center mt-12">
        <div className="flex justify-center items-center gap-16">
          <div className="text-center">
            <div className="border-t-2 border-gray-400 w-40 mx-auto pt-2">
              <p className="font-bold">Institute Director</p>
              <p>Tristan Tal</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-8">Certificate ID: {certificate._id}</p>
      </div>
    </div>
  );
};

// When the student has no certificates to be displayed
const EmptyCertificateState = () => (
  <div className="text-center p-8 border border-gray-200 rounded-lg">
    <p className="text-gray-600 mt-4">No certificates found. Complete a course to earn a certificate.</p>
  </div>
);

// Loading Spinner during the certificate fetching process
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <p className="ml-2 text-gray-600">Loading certificates...</p>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-4">
    <p className="flex items-center">
      {message}
    </p>
  </div>
);

// Certificate Card Component. It displays a certificate with a download button
const CertificateCard = ({ certificate, onDownload }) => (
  <div className=" flex p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-mdvtransition-shadow">
      <div className='bg-white m-2 h-32 w-42 rounded-lg'>
                            {certificate.enrollment.course.subject === "Mathematics" ?
                            <img src={math} alt="math" title="Math" className="w-full h-full object-fill rounded-lg"/>:
                            certificate.enrollment.course.subject === "Physics" ?
                            <img src={physics} alt="physics" title="Physics" className="w-full h-full object-fill rounded-lg"/>:
                            certificate.enrollment.course.subject === "Biology" ?
                            <img src={biology} alt="biology" title="Biology" className="w-full h-full object-fill rounded-lg"/>:
                            certificate.enrollment.course.subject === "Computer Science" ? 
                            <img src={compsci} alt="computer science" title="Computer Science" className="w-full h-full object-fill rounded-lg"/>:
                            certificate.enrollment.course.subject === "Engineering" ?
                            <img src={engineering} alt="engineering" title="Engineering" className="w-full h-full object-fill rounded-lg"/>:
                            <img src={science} alt="generic science" title="Generic" className="w-full h-full object-fill rounded-lg"/>
                        }
      </div>
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900">{certificate.enrollment.course.title}</h3>
        <p className="text-gray-700">
          Student: <span className="font-medium">{certificate.enrollment.student.name}</span>
        </p>
        <p className="text-gray-700">
          Issued On: <span className="font-medium">
            {certificate.issued_on}
          </span>
        </p>
      </div>
    </div>
    <div className="flex gap-2">
        <button
          onClick={() => onDownload(certificate)}
          className="px-4 py-2 bg-white text-black font-medium rounded-md transition duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </button>
      </div>
  </div>
);

// Main Component that fetches and displays the certificates
const StudentCertificates = ({ baseURL }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  
  // react-to-pdf hook. Allows pdf dynamic generation.
  const { toPDF, targetRef } = usePDF({
    filename: selectedCertificate ? 
      `${selectedCertificate.enrollment.student.name}_${selectedCertificate.enrollment.course.title}_Certificate.pdf` : 
      'certificate.pdf',
    options: {
      format: [210, 210], 
      unit: 'mm',
    },
  });

  // Fetch all data at once
  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = sessionStorage.getItem("Token");
      const enrollmentsResponse = await fetch(`${baseURL}/enrollments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!enrollmentsResponse.ok) {
        throw new Error("Failed to fetch enrollments");
      }

      const enrollmentsData = await enrollmentsResponse.json();
    
      // Fetch certificates
      const certificatesResponse = await fetch(`${baseURL}/certificates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(certificatesResponse.status === 404){
        setError("You Have no certificates.")
      }
      else if (!certificatesResponse.ok) {
        setError("Failed to load certificates. Please try again later.");
        throw new Error("Failed to fetch certificates");
      }

      const certificatesData = await certificatesResponse.json();
      
      // Process certificates with enrollment data
      const processedCertificates = certificatesData.map(certificate => {
        const matchingEnrollment = enrollmentsData.find(
          enrollment => enrollment._id === certificate.enrollment_id
        );
        
        if (matchingEnrollment) {
          return {
            ...certificate,
            enrollment: matchingEnrollment
          };
        }
        return null;
      }).filter(cert => cert !== null);
      
      setCertificates(processedCertificates);
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handle downloading the certificate and
  // a Short delay to ensure state is updated before generating PDF
  const handleDownload = useCallback((certificate) => {
    setSelectedCertificate(certificate);
    
    setTimeout(() => {
      toPDF();
    }, 100);
  }, [toPDF]);

  // Check if a certificate has all required data
  const isValidCertificate = useCallback((cert) => {
    return (
      cert &&
      cert.enrollment &&
      cert.enrollment.student &&
      cert.enrollment.student.name &&
      cert.enrollment.course &&
      cert.enrollment.course.title
    );
  }, []);

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => 
      isValidCertificate(cert) && 
      (cert.enrollment.course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       cert.enrollment.student.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const dateA = new Date(a.issued_on.split("/")[2],a.issued_on.split("/")[1], a.issued_on.split("/")[0],0,0,0,0);
      const dateB = new Date(a.issued_on.split("/")[2],a.issued_on.split("/")[1], a.issued_on.split("/")[0],0,0,0,0);;
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">My Certificates</h2>
      
      {/* Search and filter for certs */}
      {certificates.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by course or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-none">
            <select 
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition duration-300 flex items-center justify-center"
            title="Refresh certificates"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      )}
      
      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {/* Certificate list */}
      {!loading && !error && filteredCertificates.length > 0 ? (
        <div className="space-y-4">
          {filteredCertificates.map((certificate) => (
            <CertificateCard 
              key={certificate._id} 
              certificate={certificate} 
              onDownload={handleDownload} 
            />
          ))}
        </div>
      ) : !loading && !error ? (
        <EmptyCertificateState />
      ) : null}

      {/*} Hidden certificate template for PDF generation.
      Generates a certificate as a PDF without displaying it on the screen. */}
      <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
        <div ref={targetRef}>
          {selectedCertificate && <CertificateTemplate certificate={selectedCertificate} />}
        </div>
      </div>
    </div>
  );
};

export default StudentCertificates;