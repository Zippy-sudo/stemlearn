import React, { useState, useEffect } from "react";

const CreateCertificate = ({ baseURL }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all enrollments and certificates
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = sessionStorage.getItem("Token");
        if (!token) {
          throw new Error("Authentication token not found");
        }

        // Fetch enrollments
        const enrollmentsResponse = await fetch(`${baseURL}/enrollments`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!enrollmentsResponse.ok) {
          throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.status}`);
        }

        const enrollmentsData = await enrollmentsResponse.json();
        
        // Filter enrollments with 100% completion
        const completedEnrollments = enrollmentsData.filter(
          (enrollment) => enrollment.completion_percentage === 100
        );
        setEnrollments(completedEnrollments);

        // Fetch certificates
        try {
          const certificatesResponse = await fetch(`${baseURL}/certificates`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Handle successful response
          if (certificatesResponse.ok) {
            const certificatesData = await certificatesResponse.json();
            setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
          } 
          //  handling for 404 - backend returns 404 when no certificates exist
          else if (certificatesResponse.status === 404) {
            setCertificates([]);
            console.log("No certificates in database");
          } 
          else {
            throw new Error(`Failed to fetch certificates: ${certificatesResponse.status}`);
          }
        } catch (certErr) {
          console.error("Certificate fetch error:", certErr);
          setCertificates([]);
        }
      } catch (err) {
        console.error("General fetch error:", err);
        setError(`Error: ${err.message}`);
        setEnrollments([]);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL]);

  // Check if an enrollment already has a certificate
  const isEnrollmentCertified = (enrollmentId) => {
    return Array.isArray(certificates) && certificates.some(
      (certificate) => certificate.enrollment_id === enrollmentId
    );
  };

  // Handle certificate creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!selectedEnrollmentId) {
      setError("Please select an enrollment");
      return;
    }

    try {
      setLoading(true);
      const token = sessionStorage.getItem("Token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await fetch(`${baseURL}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enrollment_id: selectedEnrollmentId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.Error || `Failed to create certificate: ${response.status}`);
      }

      await refreshData(token);

      setMessage(data.Success || "Certificate created successfully!");
      setSelectedEnrollmentId("");
    } catch (err) {
      console.error("Create certificate error:", err);
      setError(`Error creating certificate: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle certificate deletion
  const handleDeleteCertificate = async (enrollmentId) => {
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const token = sessionStorage.getItem("Token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      if (!Array.isArray(certificates)) {
        throw new Error("Certificates data is not available");
      }

      const certificate = certificates.find(
        (cert) => cert.enrollment_id === enrollmentId
      );

      if (!certificate) {
        throw new Error("Certificate not found");
      }

      const response = await fetch(`${baseURL}/certificates/${certificate._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Error || `Failed to delete certificate: ${response.status}`);
      }

      const data = await response.json().catch(() => ({ Success: "Certificate deleted successfully" }));

      await refreshData(token);

      setMessage(data.Success || "Certificate deleted successfully!");
    } catch (err) {
      console.error("Delete certificate error:", err);
      setError(`Error deleting certificate: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async (token) => {
    try {
      // Fetch enrollments
      const enrollmentsResponse = await fetch(`${baseURL}/enrollments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        const completedEnrollments = enrollmentsData.filter(
          (enrollment) => (enrollment.progresses/enrollment.course.lessons) * 100 === 1
        );
        setEnrollments(completedEnrollments);
      }

      // Fetch certificates, handling 404 as empty array
      const certificatesResponse = await fetch(`${baseURL}/certificates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (certificatesResponse.ok) {
        const certificatesData = await certificatesResponse.json();
        setCertificates(Array.isArray(certificatesData) ? certificatesData : []);
      } else if (certificatesResponse.status === 404) {
        setCertificates([]);
      }
    } catch (err) {
      console.error("Refresh data error:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">AWARD CERTIFICATIONS</h2>
      
      {loading && <p className="text-gray-600 text-center mb-4">Loading...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {message && <p className="text-green-500 text-center mb-4">{message}</p>}

      {/* Certificate Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <select
            id="enrollmentId"
            value={selectedEnrollmentId}
            onChange={(e) => setSelectedEnrollmentId(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an enrollment</option>
            {enrollments.length > 0 ? (
              enrollments.map((enrollment) => (
                <option
                  key={enrollment._id}
                  value={enrollment._id}
                  disabled={isEnrollmentCertified(enrollment._id)}
                >
                  {enrollment.student.name} - {enrollment.course.title} (
                  {enrollment.completion_percentage}%)
                  {isEnrollmentCertified(enrollment._id) && " (Certified)"}
                </option>
              ))
            ) : (
              <option disabled>No completed enrollments found</option>
            )}
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading || isEnrollmentCertified(selectedEnrollmentId) || !selectedEnrollmentId}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Certificate
        </button>
      </form>

      {/* Certificate Deletion Section */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Delete Certificates</h3>
        {Array.isArray(certificates) && certificates.length > 0 ? (
          <ul className="space-y-4">
            {enrollments
              .filter((enrollment) => isEnrollmentCertified(enrollment._id))
              .map((enrollment) => (
                <li key={enrollment._id} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-medium">
                        {enrollment.student.name} - {enrollment.course.title}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCertificate(enrollment._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-300 disabled:opacity-50"
                    >
                      Delete Certificate
                    </button>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No certificates found</p>
        )}
      </div>
    </div>
  );
};

export default CreateCertificate;