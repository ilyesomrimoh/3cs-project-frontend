import { useEffect, useState } from "react";
import { getAllStudentsInClass } from "../../services/api";
import { generateAttendancePDF } from "../../pdfGenerator";


const FullAttendanceModal = ({classInfo , classId ,  onClose  , results = []  , user }) => {
  // const [presentStudents, setPresentStudents] = useState(results);
  const presentStudents = [{ id: 1, name: 'omri mohammed ilyes' }, { id: 2, name: 'ilyes haddad' }];
    const [allStudents, setAllStudents] = useState([]);
  
  const [isGenerating, setIsGenerating] = useState(false);

  const fetchData = async () => {
    
    const res2 = await getAllStudentsInClass(classId, user.token);
    if (res2) {
      setAllStudents(res2);
    }
  };

  useEffect(()=>{
    fetchData();
    console.log(classInfo);
  },[])

  const presentNamesSet = new Set(presentStudents.map(s => s.name));
  

    // Use names to mark present
 const  list = allStudents.map((student) => ({
     id: student.id,
     name: student.name,
     status: presentNamesSet.has(student.name) ? "Present" : "Absent",
   }));
 
  


   
 // Handle PDF generation
 const handleGeneratePDF = () => {
  setIsGenerating(true);

  setTimeout(() => {
    try {
      generateAttendancePDF(list , classInfo)
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  }, 300);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Full Attendance List</h2>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((student, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{student.name}</td>
                <td
                  className={`border px-4 py-2 ${
                    student.status === "Present" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {student.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 flex justify-between">
  <button
    onClick={handleGeneratePDF}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    Generate PDF
  </button>
  <button
    onClick={onClose}
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Close
  </button>
</div>

      </div>
    </div>
  );
};

export default FullAttendanceModal;
