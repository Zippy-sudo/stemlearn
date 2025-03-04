import { useState } from "react";
import AdmSidebar from "../components/AdmSidebar";
import CourseManagement from "../components/CourseManagement";
import AddTeacherForm from "../components/AddTeacherForm";
import Enrollments from "../components/Enrollments";
import StudentManagement from "../components/StudentManagement";
import ActivityTracker from "../components/ActivityTracker";

function AdmDashboard({ baseURL }) {
  const [selectedPage, setSelectedPage] = useState("courses");

  return (
    <div className="flex">
      <AdmSidebar setSelectedPage={setSelectedPage} />
      <div className="flex-1 p-6 overflow-auto">
        {selectedPage === "course-management" && <CourseManagement baseURL={baseURL} />}
        {selectedPage === "teacher-management" && <AddTeacherForm baseURL={baseURL} />}
        {selectedPage === "enrollments" && <Enrollments baseURL={baseURL} />}
        {selectedPage === "student-management" && <StudentManagement baseURL={baseURL} />}
        {selectedPage === "activities" && <ActivityTracker baseURL={baseURL} />}
      </div>
    </div>
  );
}

export default AdmDashboard;
