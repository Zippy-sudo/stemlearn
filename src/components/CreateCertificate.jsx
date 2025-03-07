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
      try {
        const token = sessionStorage.getItem("Token");

        // Fetch enrollments
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

        if (!certificatesResponse.ok) {
          throw new Error("Failed to fetch certificates");
        }

        const certificatesData = await certificatesResponse.json();

        // Filter enrollments with 100% completion
        const completedEnrollments = enrollmentsData.filter(
          (enrollment) => enrollment.completion_percentage === 100
        );
        setEnrollments(completedEnrollments);
        setCertificates(certificatesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL]);

  // Check if an enrollment already has a certificate
  const isEnrollmentCertified = (enrollmentId) => {
    return certificates.some(
      (certificate) => certificate.enrollment_id === enrollmentId
    );
  };

  // Handle certificate creation
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEnrollmentId) {
      setError("Please select an enrollment");
      return;
    }

    try {
      const token = sessionStorage.getItem("Token");
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
        throw new Error(data.Error || "Failed to create certificate");
      }

      const enrollmentsResponse = await fetch(`${baseURL}/enrollments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const certificatesResponse = await fetch(`${baseURL}/certificates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enrollmentsData = await enrollmentsResponse.json();
      const certificatesData = await certificatesResponse.json();

      // Filter enrollments with 100% completion
      const completedEnrollments = enrollmentsData.filter(
        (enrollment) => enrollment.completion_percentage === 100
      );

      setEnrollments(completedEnrollments);
      setCertificates(certificatesData);

      setMessage("Certificate created successfully!");
      setError("");
      setSelectedEnrollmentId("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  // Handle certificate deletion
  const handleDeleteCertificate = async (enrollmentId) => {
    try {
      const token = sessionStorage.getItem("Token");

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
        throw new Error("Failed to delete certificate");
      }

      const enrollmentsResponse = await fetch(`${baseURL}/enrollments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const certificatesResponse = await fetch(`${baseURL}/certificates`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const enrollmentsData = await enrollmentsResponse.json();
      const certificatesData = await certificatesResponse.json();

      // Filters enrollments with 100% completion
      // to enrollments that already have a 100% completion and have already been certified
      // they have a tag indicating certified and the option to select it is disabled.
      const completedEnrollments = enrollmentsData.filter(
        (enrollment) => enrollment.completion_percentage === 100
      );

      setEnrollments(completedEnrollments);
      setCertificates(certificatesData);

      setMessage("Certificate deleted successfully!");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">AWARD CERTIFICATIONS</h2>
      
      {loading && <p className="text-gray-600 text-center mb-4">Loading enrollments...</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
            {enrollments.map((enrollment) => (
              <option
                key={enrollment._id}
                value={enrollment._id}
                disabled={isEnrollmentCertified(enrollment._id)}
              >
                {enrollment.student.name} - {enrollment.course.title} (
                {enrollment.completion_percentage}%)
                {isEnrollmentCertified(enrollment._id) && " (Certified)"}
              </option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          disabled={loading || isEnrollmentCertified(selectedEnrollmentId)}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Certificate
        </button>
      </form>

      {/* Delete Certificate Button for Certified Enrollments */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-center text-gray-800 mb-4">Delete Certificates</h3>
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
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-300"
                  >
                    Delete Certificate
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {message && <p className="text-green-500 text-center mt-4">{message}</p>}
    </div>
  );
};

export default CreateCertificate;