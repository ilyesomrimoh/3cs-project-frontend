// This file contains API functions that would connect to a backend in a real app
import axios from "axios";
const DEMO_MODE = true;


export const getClasses = async (token) => {
  try {
    if (DEMO_MODE) {
     
      return {
        success: true , data: [
            { id: 1, name: 'Math 101', description: 'Basic Mathematics' , group:'Gr1', totalStudents:32  } ,
           { id: 2, name: 'Math 102', description: 'ALgerbra' , group:'Gr2', totalStudents:22 },
            { id: 3, name: 'Math 103', description: 'Geometry' , group:'Gr3', totalStudents:30 },
            { id: 4, name: 'algorithm 101', description: 'Basic algorithm' , group:'Gr4', totalStudents:29},
            { id: 6, name: 'Data structure 101', description: 'Basic Data structure', group:'Gr5', totalStudents:26 }
          ]}
        
        
      }else{
       
       console.log('this is the class fct token ' , token);
    const response = await axios.get('http://localhost:5000/classes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
          return { success: true, data: response.data };

      }
   


  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return { success: false, message: error.response?.data?.msg || 'Error fetching classes' };
  }
};
export const startAttendance = async (classId, token) => {
  try {
    if (DEMO_MODE) {
      return {
        success: true
        , data: {
          jobId: "demo_job_id",
          statusUrl: "http://localhost:5000/presence/status/demo_job_id"
        }
      };
    }

    const response = await axios.post(
      `http://localhost:5000/presence/${classId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 202) {
      return {
        success: true,
        data: {
          jobId: response.data.job_id,
          statusUrl: `http://localhost:5000${response.data.status_url}`,
        },
      };
    } else {
      return { success: false, message: 'Unexpected response from server' };
    }

  } catch (error) {
    console.error('Failed to start attendance:', error);
    return { success: false, message: error.response?.data?.msg || 'Error starting attendance' };
  }
};

// Start attendance for a specific class
export const getAttendanceStatus = async (statusUrl, token) => {
  try {
    if (DEMO_MODE) {
      // Simulate a completed attendance after a few checks
      const randomDelay = Math.random() * 15000 + 5000; // 5-20 seconds
      await new Promise((resolve) => setTimeout(resolve, randomDelay));
      return {
        success: true,
        completed: true,
        data: [
          { id: 1, name: 'omri mohammed ilyes', email: 'omri@gmail.com' },
          { id: 2, name: 'ilyes haddad', email: 'haddad@gmail.com ' }
        ]
      };
    }

    const response = await axios.get(`${statusUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      
    if (response.data.status === 'done') {

      const  parsed = response.data;
      return {
        success: true,
        completed: true,
        data: parsed.result,
      };
    }
    

  } catch (error) {
    console.error('Failed to get attendance status:', error);
    return { success: false, message: error.response?.data?.msg || 'Error getting status' };
  }
};


export const getAllStudentsInClass = async (classId, token) => {
  try {
    if (DEMO_MODE) {
      return [
        { id: 1, name: 'omri mohammed ilyes', email: 'omri@gmail.com' },
        { id: 2, name: 'ilyes haddad', email: 'haddad@gmail.com' },
        { id: 3, name: 'faressi elhadj madani', email: 'farssi@gmail.com' },
        { id: 4, name: 'bouheni othmane', email: 'bouheni@gmail.com' },
        { id: 5, name: 'ramzi', email: 'ramzi@gmail.com' },

          ]
    }else{
  const response = await axios.get('http://localhost:5000/students', {
      params: { class_id: classId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    }
          
    

  if (response.status===200){
    return response.data; 
  }
  
  } catch (error) {
    console.error('Failed to fetch students:', error.response?.data || error.message);
    throw error;
  }
};