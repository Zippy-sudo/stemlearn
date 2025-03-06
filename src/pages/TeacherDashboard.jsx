import { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherCourses from "../components/TeacherCourses";
import LessonResources from "../components/LessonResources";
import Feedback from "../components/Feedback";

function TeacherDashboard({ baseURL }) {
  const [selectedPage, setSelectedPage] = useState("courses");

  return (
    <div className="flex">
      <TeacherSidebar setSelectedPage={setSelectedPage} />

      <div className="flex-1 p-6">
        {selectedPage === "courses" && <TeacherCourses baseURL={baseURL} />}
        {selectedPage === "lesson-resources" && <LessonResources baseURL={baseURL} />}
        {selectedPage === "feedback" && <Feedback baseURL={baseURL} />}
      </div>
    </div>
  );
}

export default TeacherDashboard;