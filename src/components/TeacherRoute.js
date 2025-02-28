import { Navigate } from "react-router-dom";

function TeacherRoute({ children }) {
  const role = localStorage.getItem("role");
  
  if (role !== "TEACHER") {
    alert("Unauthorized access!");
    return <Navigate to="/" />;
  }
  return children;
}

export default TeacherRoute;