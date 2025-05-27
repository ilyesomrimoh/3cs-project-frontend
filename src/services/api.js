// This file contains API functions that would connect to a backend in a real app
import axios from "axios";


export const getClasses = async (token) => {
  try {
    console.log('this is the class fct token ' , token);
    const response = await axios.get('http://localhost:5000/classes', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return { success: true, data: response.data };

  } catch (error) {
    console.error('Failed to fetch classes:', error);
    return { success: false, message: error.response?.data?.msg || 'Error fetching classes' };
  }
};
export const startAttendance = async (classId, token) => {
  try {
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
    const response = await axios.get('http://localhost:5000/students', {
      params: { class_id: classId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  if (response.status===200){
    return response.data; 
  }
  
  } catch (error) {
    console.error('Failed to fetch students:', error.response?.data || error.message);
    throw error;
  }
};