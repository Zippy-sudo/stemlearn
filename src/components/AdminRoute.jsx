import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminRoute({children }) {
  const navigate = useNavigate()
  const role = sessionStorage.getItem("Role");
  
  useEffect(() => {
    if (!role){
      navigate("/Login")
    }
  
    if (role !== "ADMIN") {
      alert("Unauthorized access!");
      navigate("/")
    }
  }, [role])

  if(role !== "ADMIN"){
    return null
  }

  return children
}

export default AdminRoute;