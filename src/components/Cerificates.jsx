import React, { useEffect, useState } from 'react';

const CertificatesPage = ({ studentId }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch certificates from the backend
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5555/certificates/${studentId}`);
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
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
