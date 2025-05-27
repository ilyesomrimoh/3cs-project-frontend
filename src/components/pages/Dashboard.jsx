import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import ClassCard from '../dashboard/ClassCard';
import Header from '../dashboard/Header';
import AttendanceModal from '../dashboard/AttendanceModal';
import { getClasses, startAttendance } from '../../services/api';
import FullAttendanceModal from '../dashboard/FullAttendanceModal';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [attendanceSession, setAttendanceSession] = useState(null);
  const [startingAttendance, setStartingAttendance] = useState(false);
  const [showFullListModal, setShowFullListModal] = useState(false);
  const [results, setResults] = useState([]);


  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const result = await getClasses(user.token);
        if (result.success) {
          setClasses(result.data);
        } else {
          setError('Failed to load classes');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);


 
  
  const handleStartAttendance = async (classInfo) => {
    setSelectedClass(classInfo);
    setStartingAttendance(true);
    
    try {
      const result = await startAttendance(classInfo.id , user.token);

      if (result.success) {
        setAttendanceSession(result.data);
        setModalOpen(true);
        console.log('attendence session ssssss',attendanceSession);

      } else {
        setError(result.message || 'Failed to start attendance');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
    } finally {
      setStartingAttendance(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setAttendanceSession(null);
    setSelectedClass(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogout={logout} />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Classes</h1>
          <p className="mt-2 text-gray-600">Select a class to take attendance using face recognition</p>
        </div>
        
        {error && (
          <motion.div 
            className="bg-error-50 text-error-700 p-4 rounded-md mb-6 border border-error-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm font-medium">{error}</p>
            <Button 
              variant="danger" 
              size="sm" 
              className="mt-2"
              onClick={() => setError('')}
            >
              Dismiss
            </Button>
          </motion.div>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {classes.map((classInfo) => (
                <motion.div
                  key={classInfo.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  <ClassCard 
                    classInfo={classInfo}
                    onStartAttendance={handleStartAttendance}
                    isLoading={startingAttendance && selectedClass?.id === classInfo.id}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
      
      <AnimatePresence>
        {modalOpen && (
          <AttendanceModal
            isOpen={modalOpen}
            onClose={closeModal}
            attendanceSession={attendanceSession}
            classInfo={selectedClass}
            setShowFullListModal ={setShowFullListModal}
            result={results}
            setResults={setResults}
     

          />
        )}

        {showFullListModal && results   && (
        <FullAttendanceModal
        // sessionId={attendanceSession?.data?.jobId}
        classId={selectedClass.id}
        classInfo={selectedClass}
        onClose={() => setShowFullListModal(false)}
        results={results}
        setResults={setResults}
        user={user}

         />
        )}

      </AnimatePresence>
    </div>
  );
}