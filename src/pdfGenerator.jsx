import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


export const generateAttendancePDF = (students , classInfo) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Attendance Report", 14, 20);
  
  // Add class name if provided
  if (classInfo) {
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text(`Class: ${classInfo?.name}  ${classInfo?.group}`, 14, 30);
  }
  
  // Add date
  const date = new Date().toLocaleDateString();
  doc.setFontSize(12);
  doc.text(`Date: ${date}`, 14, classInfo ? 40 : 30);
  
  // Add time
  const time = new Date().toLocaleTimeString();
  doc.text(`Time: ${time}`, 14, classInfo ? 48 : 38);
  
  // Count statistics
  const presentCount = students.filter(s => s.status === "Present").length;
  const absentCount = students.filter(s => s.status === "Absent").length;
  const totalCount = students.length;
  
  // Add statistics
  doc.text(`Total Students: ${totalCount}`, 14, classInfo ? 56 : 46);
  doc.text(`Present: ${presentCount}`, 14, classInfo ? 64 : 54);
  doc.text(`Absent: ${absentCount}`, 14, classInfo ? 72 : 62);

  // Create the table
  autoTable(doc, {
    head: [['Name', 'Status']],
    body: students.map(student => [student.name, student.status]),
    startY: classInfo ? 80 : 70,
    styles: { 
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 40 }
    },
    didDrawCell: (data) => {
      // Color the status cell based on attendance
      if (data.column.index === 1 && data.section === 'body') {
        const status = data.cell.raw;
        if (status === 'Present') {
          doc.setTextColor(0, 128, 0); // Green for present
        } else {
          doc.setTextColor(255, 0, 0); // Red for absent
        }
      }
    },
    didParseCell: (data) => {
      // Reset text color after each cell is parsed
      doc.setTextColor(0, 0, 0);
    }
  });
  
  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  doc.save("attendance-report.pdf");
};