function Sidebar({ setSelectedPage }) {
    return (
      <div className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">Teacher Dashboard</h2>
        <ul className="space-y-2">
          <li>
            <button onClick={() => setSelectedPage("courses")} className="block p-2 w-full text-left hover:bg-gray-700">
              Your Courses
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedPage("lesson-resources")} className="block p-2 w-full text-left hover:bg-gray-700">
              Lesson Resources
            </button>
          </li>
        </ul>
      </div>
    );
  }
  
  export default Sidebar;
  