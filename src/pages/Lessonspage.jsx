import React, {useState} from 'react';

function LessonsPage({course}){
   const [lesson, setLesson] = useState(null)
   const toogleLesson = (lessonId) => {
    setLesson(lesson === lessonId ? null : lessonId);
   };

 
}
export default LessonsPage;