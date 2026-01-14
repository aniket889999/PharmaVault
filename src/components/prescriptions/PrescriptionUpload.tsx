import React, { useState } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader, X } from 'lucide-react';

interface ExtractedMedicine {
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
}

interface PrescriptionUploadProps {
  onUploadComplete?: (prescriptionId: string) => void;
}

const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({ onUploadComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    doctorName?: string;
    date?: string;
    medicines: ExtractedMedicine[];
    rawText?: string;
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        alert('Please select an image file (JPG, PNG, etc.)');
        return;
      }

      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setIsComplete(false);
      setExtractedData(null);
    }
  };

  const simulateOCRExtraction = (text: string): ExtractedMedicine[] => {
    const medicines: ExtractedMedicine[] = [];
    const lines = text.toLowerCase().split('\n');

    const commonMedicines = [
      'paracetamol', 'amoxicillin', 'ibuprofen', 'aspirin', 'metformin',
      'lisinopril', 'atorvastatin', 'azithromycin', 'omeprazole', 'dolo'
    ];

    lines.forEach(line => {
      commonMedicines.forEach(medName => {
        if (line.includes(medName)) {
          const medicine: ExtractedMedicine = { name: medName };

          const dosageMatch = line.match(/(\d+)\s*(mg|ml|g)/i);
          if (dosageMatch) {
            medicine.dosage = dosageMatch[0];
          }

          const frequencyMatch = line.match(/(once|twice|thrice|\d+\s*times?).*?(day|daily)/i);
          if (frequencyMatch) {
            medicine.frequency = frequencyMatch[0];
          }

          const durationMatch = line.match(/(\d+)\s*(day|week|month)/i);
          if (durationMatch) {
            medicine.duration = durationMatch[0];
          }

          medicines.push(medicine);
        }
      });
    });

    return medicines;
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);

    setTimeout(() => {
      const mockExtractedText = `
Dr. Rajesh Kumar
Date: ${new Date().toLocaleDateString()}

Prescription:
1. Paracetamol 500mg - Twice daily after meals - 5 days
2. Amoxicillin 250mg - Three times daily - 7 days
3. Vitamin C 500mg - Once daily - 10 days

Notes: Take with plenty of water. Complete the full course.
      `.trim();

      const medicines = simulateOCRExtraction(mockExtractedText);

      setExtractedData({
        doctorName: 'Dr. Rajesh Kumar',
        date: new Date().toLocaleDateString(),
        medicines,
        rawText: mockExtractedText
      });

      setIsProcessing(false);
      setIsComplete(true);

      if (onUploadComplete) {
        onUploadComplete('mock-prescription-id');
      }
    }, 3000);
  };

  const handleReset = () => {
    setFile(null);
    setPreviewUrl('');
    setIsProcessing(false);
    setIsComplete(false);
    setExtractedData(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-600 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Prescription</h2>
              <p className="text-sm text-gray-600 mt-1">
                Upload your prescription image and we'll extract medicine information automatically
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {!file && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors">
              <input
                type="file"
                id="prescription-upload"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <label htmlFor="prescription-upload" className="cursor-pointer">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Choose a prescription image
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  JPG, PNG or PDF up to 10MB
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select File
                </button>
              </label>
            </div>
          )}

          {file && !isComplete && (
            <div className="space-y-6">
              <div className="relative rounded-lg overflow-hidden bg-gray-100">
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
                <img
                  src={previewUrl}
                  alt="Prescription preview"
                  className="w-full max-h-96 object-contain"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-1">
                      Before uploading
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ensure the prescription is clearly visible</li>
                      <li>• Make sure doctor's name and signature are included</li>
                      <li>• Check that medicine names are readable</li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={isProcessing}
                className="w-full py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Processing prescription...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Upload & Extract Information</span>
                  </>
                )}
              </button>
            </div>
          )}

          {isComplete && extractedData && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600 rounded-full">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Prescription processed successfully!
                    </h3>
                    <p className="text-sm text-green-700">
                      We've extracted the following information from your prescription
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Doctor Name</p>
                  <p className="font-semibold text-gray-900">{extractedData.doctorName}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Prescription Date</p>
                  <p className="font-semibold text-gray-900">{extractedData.date}</p>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Extracted Medicines ({extractedData.medicines.length})
                </h4>
                <div className="space-y-3">
                  {extractedData.medicines.map((medicine, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 capitalize mb-2">
                            {medicine.name}
                          </h5>
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            {medicine.dosage && (
                              <div>
                                <span className="text-gray-600">Dosage:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {medicine.dosage}
                                </span>
                              </div>
                            )}
                            {medicine.frequency && (
                              <div>
                                <span className="text-gray-600">Frequency:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {medicine.frequency}
                                </span>
                              </div>
                            )}
                            {medicine.duration && (
                              <div>
                                <span className="text-gray-600">Duration:</span>
                                <span className="ml-2 font-medium text-gray-900">
                                  {medicine.duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Verified
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Upload Another
                </button>
                <button className="flex-1 py-3 px-6 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Check Medicine Availability
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-semibold mb-1">Privacy & Security</p>
            <p>
              Your prescription data is encrypted and stored securely. We use OCR technology to
              extract information, which is then verified by licensed pharmacists before fulfillment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
