import { useState } from "react";
import TeacherSidebar from "../components/TeacherSidebar";
import TeacherCourses from "../components/TeacherCourses";
import LessonResources from "../components/LessonResources";
import Feedback from "../components/Feedback";
import Teacherquiz from "./TeacherQuizzesDashboard";

function TeacherDashboard({ baseURL, loggedIn}) {
  const [selectedPage, setSelectedPage] = useState("courses");

  return (
    <div className="flex">
      <TeacherSidebar setSelectedPage={setSelectedPage} />

      <div className="flex-1 p-6">
        {selectedPage === "courses" && <TeacherCourses baseURL={baseURL} loggedIn={loggedIn}/>}
        {selectedPage === "lesson-resources" && (
          <LessonResources baseURL={baseURL} loggedIn={loggedIn}/>
        )}
        {selectedPage === "feedback" && <Feedback baseURL={baseURL} loggedIn={loggedIn}/>}
        {selectedPage === "Teacherquiz" && <Teacherquiz baseURL={baseURL} loggedIn={loggedIn}/>}
      </div>
    </div>
  );
}

export default TeacherDashboard;
