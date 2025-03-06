function AdmSidebar({ setSelectedPage }) {
    return (
      <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setSelectedPage("course-management")} className="block p-2 w-full text-left hover:bg-gray-700">
              Course Management
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedPage("teacher-management")} className="block p-2 w-full text-left hover:bg-gray-700">
              Teacher Management
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedPage("enrollments")} className="block p-2 w-full text-left hover:bg-gray-700">
              Enrollments
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedPage("student-management")} className="block p-2 w-full text-left hover:bg-gray-700">
              Student Management
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedPage("activity-tracker")} className="block p-2 w-full text-left hover:bg-gray-700">
              Activity Tracker
            </button>
          </li>
        </ul>
      </div>
    );
  }

  export default AdmSidebar;