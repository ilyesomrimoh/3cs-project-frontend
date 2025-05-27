import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import LiveAttendanceModal from './LiveAttendanceModal';

const availableRooms = [
  { id: 'room101', name: 'Room 101' },
  { id: 'room102', name: 'Room 102' },
  { id: 'room103', name: 'Room 103' },
  { id: 'room104', name: 'Room 104' },
  { id: 'room105', name: 'Room 105' },
];

export default function ClassCard({ classInfo, onStartAttendance, isLoading = false }) {
  const { name, group, totalStudents, room } = classInfo;
  
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const handleMakeAttendance = () => {
    if (!selectedRoom) {
      setValidationError('Please select a room first');
      return;
    }
    
    setValidationError('');
    setIsModalOpen(true);
  };
  
  const handleStartAttendance = () => {
    onStartAttendance({
      ...classInfo,
      selectedRoom
    });
    setIsModalOpen(false);
  };
  
  return (
    <>
      <div className="card card-hover p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{name}</h3>
            <p className="text-primary-600 font-medium">{group || 'No Group'}</p>
          </div>
          <span className="bg-primary-50 text-primary-700 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {totalStudents || 'N/A'} Students
          </span>
        </div>
        
      
        
        <div className="mb-6">
          <label htmlFor={`room-select-${name}`} className="block text-sm font-medium text-gray-700 mb-1">
            Select Room
          </label>
          <div className="relative">
            <select
              id={`room-select-${name}`}
              value={selectedRoom}
              onChange={(e) => {
                setSelectedRoom(e.target.value);
                setValidationError('');
              }}
              className="block w-full px-4 py-2 pr-8 rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            >
              <option value="">Choose a room...</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
          {validationError && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600"
            >
              {validationError}
            </motion.p>
          )}
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleMakeAttendance}
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            Make Class Attendance
          </Button>
        </motion.div>
      </div>
      
      <LiveAttendanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStartAttendance={handleStartAttendance}
        classInfo={{ ...classInfo, selectedRoom }}
        isLoading={isLoading}
      />
    </>
  );
}