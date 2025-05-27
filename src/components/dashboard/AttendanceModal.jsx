import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import { getAttendanceStatus , getAllStudentsInClass } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';


const backdrop = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

const modal = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', damping: 25, stiffness: 300 }
  },
  exit: { 
    opacity: 0, 
    y: 50, 
    scale: 0.95,
    transition: { duration: 0.2 }
  }
};

export default function AttendanceModal({ isOpen, onClose, attendanceSession, classInfo  , setShowFullListModal , setResults }) {
  const [stage, setStage] = useState('processing'); // 'processing', 'completed'
  const [localRes, setLocalRes] = useState(null);

  const {user} = useAuth();

  

  useEffect(() => {
    let interval;
    const pollStatus = async () => {
      const res = await getAttendanceStatus(attendanceSession.statusUrl, user.token);


      if (res?.success && res?.completed) {
        console.log('stage indeide' , res.data);

        setResults(res.data);
        setLocalRes(res.data);
        setStage('completed');
        clearInterval(interval);
      } else if (!res?.success) {
        setStage('processing');
      }
    };

    interval = setInterval(pollStatus, 5000);

    pollStatus();

    return () => clearInterval(interval);
  }, [isOpen,attendanceSession]);

  
  if (!isOpen) return null;
  
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      variants={backdrop}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden"
        variants={modal}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stage === 'processing' ? 'Taking Attendance' : 'Attendance Complete'}
            </h3>
            <p className="text-gray-600">
              {stage === 'processing' 
                ? 'Face recognition is currently in progress'
                : 'Face recognition attendance has been recorded'
              }
            </p>
          </div>
          
          <div className="mb-6">
            <div className="bg-primary-50 rounded-lg p-4">
              <h4 className="font-semibold text-primary-900 mb-2">{classInfo?.name}</h4>
              <p className="text-primary-700 text-sm">{classInfo?.group} • {classInfo?.room}</p>
            </div>
          </div>
          
          {stage === 'processing' ? (
            <div className="text-center py-6">
              <div className="inline-block p-3 mb-4">
                <svg className="animate-spin h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600">Scanning and identifying students...</p>
              <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-success-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-success-100 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="font-medium text-success-900">Present</span>
                </div>
                <span className="text-success-900 font-bold">{localRes?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-error-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-error-100 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-error-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="font-medium text-error-900">Absent</span>
                </div>
                <span className="text-error-900 font-bold">{classInfo?.totalStudents -localRes?.length || 0}</span>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="font-medium text-gray-900">Total</span>
                </div>
                <span className="text-gray-900 font-bold">{classInfo?.totalStudents || 0}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <Button 
            variant="secondary"
            onClick={onClose}
            disabled={stage === 'processing'}
          >
            {stage === 'processing' ? 'Please wait...' : 'Close'}
          </Button>
         
          {stage === 'completed' && (
             <Button onClick={()=>setShowFullListModal(true)}   variant="secondary" >View Full Report</Button>
          )}


        </div>  
      </motion.div>
    </motion.div>
  );
}