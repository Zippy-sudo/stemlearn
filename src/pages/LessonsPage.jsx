import React, { useState, useEffect } from 'react';

function LessonsPage (){
    const [lessons, setLessons] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:5555/lessons", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${sessionStorage.getItem("Token")}`,
              "Content-Type": "application/json"
            }
          })
          .then(response => response.json())
          .then(data => {
            console.log("API Response:", data);  // Check the actual response
            setLessons(Array.isArray(data) ? data : []); // Ensure it's an array
          })
          .catch(error => console.error("Error fetching lessons:", error));
        }, []);
        
    

}

export default LessonsPage