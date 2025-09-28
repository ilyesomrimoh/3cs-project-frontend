import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';

const LiveAttendanceModal = ({
  isOpen,
  onClose,
  onStartAttendance,
  classInfo,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  Attendance for {classInfo.name} - {classInfo.selectedRoom || classInfo.room}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="http://192.168.76.93:5000/video_feed"
                    alt="Live Camera Feed"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Live camera feed for attendance. Make sure all students are visible.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={onClose}
                  className="bg-gray-100 text-gray-800 hover:bg-gray-200"
                  variant="secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={onStartAttendance}
                  isLoading={isLoading}
                  className="bg-primary-600"
                >
                  Start Attendance
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LiveAttendanceModal;