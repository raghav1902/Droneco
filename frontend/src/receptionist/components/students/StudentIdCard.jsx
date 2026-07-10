import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X } from 'lucide-react';

const StudentIdCard = ({ student, onClose }) => {
  const printRef = useRef();

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <style>
        @media print {
          @page { size: auto; margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; margin: 0; padding: 20px; font-family: sans-serif; display: flex; justify-content: center; align-items: flex-start; height: 100vh; background: white; }
          .id-card-wrapper { display: flex; flex-direction: column; gap: 20px; align-items: center; }
          .id-card { width: 350px; height: 550px; border: 1px solid #ccc; border-radius: 12px; overflow: hidden; background: white; box-shadow: none; position: relative; page-break-inside: avoid; }
          .id-card * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
        }
      </style>
      <div class="id-card-wrapper">${printContent}</div>
    `;

    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore React state cleanly
  };

  if (!student) return null;

  // Formatting dates and fields
  const joinDate = new Date(student.created_at || Date.now()).getFullYear();
  const validTill = new Date(joinDate + 4, 6, 31).getFullYear(); // Assuming 4 year validity
  const answers = student.answers || {};
  
  // Try to extract some useful data from dynamic answers if available
  const fatherName = answers['Father Name'] || answers['father_name'] || 'N/A';
  const motherName = answers['Mother Name'] || answers['mother_name'] || 'N/A';
  const bloodGroup = answers['Blood Group'] || answers['blood_group'] || 'O+';
  const emergencyContact = answers['Emergency Contact'] || answers['emergency_contact'] || 'N/A';
  const address = answers['Address'] || answers['address'] || student.city || 'N/A';

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex justify-center items-center overflow-y-auto p-4 sm:p-8">
      <div className="bg-card w-full max-w-4xl rounded-xl shadow-2xl border border-border flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Controls */}
        <div className="bg-muted p-6 border-b md:border-b-0 md:border-r border-border flex flex-col items-center justify-center gap-6 md:w-64">
          <div className="text-center">
            <h2 className="text-xl font-bold">Print ID Card</h2>
            <p className="text-sm text-muted-foreground mt-2">Use high-quality PVC or glossy paper for best results.</p>
          </div>
          <button 
            onClick={handlePrint}
            className="btn btn-primary w-full gap-2 shadow-sm"
          >
            <Printer className="w-5 h-5" /> Print Now
          </button>
          <button 
            onClick={onClose}
            className="btn btn-secondary w-full gap-2 shadow-sm"
          >
            <X className="w-5 h-5" /> Cancel
          </button>
        </div>

        {/* Printable Area Container */}
        <div className="p-8 flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 bg-slate-50 overflow-auto">
          <div ref={printRef} className="flex flex-col lg:flex-row gap-8 id-card-wrapper">
            
            {/* FRONT OF ID CARD */}
            <div className="id-card w-[350px] h-[550px] bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg relative flex flex-col shrink-0" style={{ fontFamily: 'sans-serif' }}>
              {/* Header */}
              <div className="bg-[#1e3a8a] text-white p-4 text-center shrink-0">
                <div className="w-12 h-12 bg-white rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-[#1e3a8a] font-bold text-xl">ABC</span>
                </div>
                <h3 className="font-bold text-lg leading-tight">ABC INSTITUTE OF TECHNOLOGY</h3>
                <p className="text-[10px] opacity-90 mt-1">Approved by AICTE | Affiliated to RTU</p>
                <div className="mt-2 bg-white text-[#1e3a8a] font-bold text-xs py-1 rounded mx-4 shadow-sm">
                  STUDENT IDENTITY CARD
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 flex flex-col">
                <div className="flex gap-4 mb-4">
                  <div className="w-24 h-28 bg-gray-200 border-2 border-gray-300 shrink-0 flex items-center justify-center text-gray-400 text-sm overflow-hidden rounded">
                    PHOTO
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h2 className="font-bold text-lg text-gray-900 leading-tight mb-1">{student.full_name}</h2>
                    <p className="text-xs text-gray-600 mb-1"><span className="font-semibold w-16 inline-block">ID:</span> {student.id || student._id}</p>
                    <p className="text-xs text-gray-600 mb-1"><span className="font-semibold w-16 inline-block">Phone:</span> {student.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-800 flex-1">
                  <div><span className="font-semibold text-gray-500 block text-[10px]">Course</span><span className="font-medium">{student.interested_course_id || 'B.Tech'}</span></div>
                  <div><span className="font-semibold text-gray-500 block text-[10px]">Department</span><span className="font-medium">Engineering</span></div>
                  <div><span className="font-semibold text-gray-500 block text-[10px]">Blood Group</span><span className="font-medium text-red-600">{bloodGroup}</span></div>
                  <div><span className="font-semibold text-gray-500 block text-[10px]">Session</span><span className="font-medium">{joinDate}-{joinDate+4}</span></div>
                </div>

                {/* Footer / Signatures */}
                <div className="flex items-end justify-between mt-4 border-t border-gray-100 pt-3 shrink-0">
                  <div className="w-16 h-16 bg-white p-1 border border-gray-200 rounded">
                    <QRCodeSVG value={student.id || student._id || 'none'} size={54} />
                  </div>
                  <div className="text-center">
                    <div className="w-24 border-b border-gray-800 mb-1"></div>
                    <p className="text-[10px] text-gray-600 font-semibold">Principal</p>
                  </div>
                </div>
              </div>
              {/* Colored bottom bar */}
              <div className="h-2 bg-yellow-500 w-full shrink-0"></div>
            </div>

            {/* BACK OF ID CARD */}
            <div className="id-card w-[350px] h-[550px] bg-white border border-gray-300 rounded-xl overflow-hidden shadow-lg relative flex flex-col shrink-0" style={{ fontFamily: 'sans-serif' }}>
              <div className="bg-gray-100 p-3 text-center border-b border-gray-200 shrink-0">
                <h3 className="font-bold text-sm text-gray-700">PERSONAL INFORMATION</h3>
              </div>
              
              <div className="flex-1 p-5 flex flex-col text-xs text-gray-800">
                <div className="mb-4">
                  <span className="font-semibold text-gray-500 block mb-1">Parent Details</span>
                  <p className="mb-1"><span className="w-16 inline-block">Father:</span> {fatherName}</p>
                  <p><span className="w-16 inline-block">Mother:</span> {motherName}</p>
                </div>
                
                <div className="mb-4">
                  <span className="font-semibold text-gray-500 block mb-1">Emergency Contact</span>
                  <p className="font-medium">{emergencyContact}</p>
                </div>
                
                <div className="mb-4">
                  <span className="font-semibold text-gray-500 block mb-1">Address</span>
                  <p className="leading-snug">{address}</p>
                </div>

                <div className="mb-4 border-t border-gray-200 pt-4 mt-auto">
                  <span className="font-semibold text-gray-500 block mb-1">Institute Contact</span>
                  <p className="mb-1">+91 12345 67890</p>
                  <p className="mb-1">admin@abcinstitute.edu</p>
                  <p>www.abcinstitute.edu</p>
                </div>

                <div className="border-t border-gray-200 pt-4 bg-gray-50 -mx-5 px-5 -mb-5 pb-5">
                  <p className="font-bold text-red-600 mb-2">Valid Till: July {validTill}</p>
                  <ul className="text-[10px] text-gray-600 list-disc pl-3 space-y-1">
                    <li>Carry this card at all times</li>
                    <li>This card is non-transferable</li>
                    <li>Report loss immediately to admin</li>
                    <li>Misuse of card is punishable</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentIdCard;
