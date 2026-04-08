import React, { useState } from 'react';
import { Shield, Search, AlertTriangle, CheckCircle, XCircle, Clock, QrCode, Camera, X } from 'lucide-react';
import { AuthenticityService } from '../../services/authenticityService';
import { AuthenticityCheck } from '../../types';
import LoadingSpinner from '../ui/LoadingSpinner';

const AuthenticityChecker: React.FC = () => {
  const [formData, setFormData] = useState({
    medicineId: '',
    batchNumber: '',
    manufacturingDate: '',
    expiryDate: ''
  });
  const [result, setResult] = useState<AuthenticityCheck | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const authenticityService = AuthenticityService.getInstance();

  const simulateScan = () => {
    setIsScanning(true);
    // Simulate API/camera parsing delay
    setTimeout(() => {
      setFormData({
        medicineId: 'med-005',
        batchNumber: 'PFE202489',
        manufacturingDate: '2024-01-15',
        expiryDate: '2025-01-15'
      });
      setIsScanning(false);
      setShowScanner(false);
    }, 1500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const check = await authenticityService.verifyMedicine(
        formData.medicineId,
        formData.batchNumber,
        formData.manufacturingDate,
        formData.expiryDate
      );
      setResult(check);
    } catch (err) {
      setError('Failed to verify medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: AuthenticityCheck['status']) => {
    switch (status) {
      case 'authentic':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
      case 'counterfeit':
        return <XCircle className="h-8 w-8 text-red-500" />;
      case 'expired':
        return <Clock className="h-8 w-8 text-orange-500" />;
      default:
        return <Shield className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AuthenticityCheck['status']) => {
    switch (status) {
      case 'authentic':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'suspicious':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'counterfeit':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'expired':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Shield className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Medicine Authenticity Checker</h1>
        </div>
        <p className="text-gray-600">
          Verify the authenticity of medicines using CDSCO and FDA databases
        </p>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowScanner(true)}
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-medium hover:bg-indigo-100 transition-colors border border-indigo-200 shadow-sm"
        >
          <QrCode className="h-5 w-5 mr-2" />
          Scan QR / Barcode
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Verification Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Verify Medicine</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="medicineId" className="block text-sm font-medium text-gray-700 mb-1">
                Medicine ID
              </label>
              <input
                type="text"
                id="medicineId"
                value={formData.medicineId}
                onChange={(e) => setFormData(prev => ({ ...prev, medicineId: e.target.value }))}
                placeholder="e.g., med-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="batchNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Batch Number
              </label>
              <input
                type="text"
                id="batchNumber"
                value={formData.batchNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, batchNumber: e.target.value }))}
                placeholder="e.g., PAR2024001"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="manufacturingDate" className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturing Date
              </label>
              <input
                type="date"
                id="manufacturingDate"
                value={formData.manufacturingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, manufacturingDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:bg-primary-400 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-2">Verifying...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Verify Medicine
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Results</h2>
          
          {!result && !loading && (
            <div className="text-center py-12">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Enter medicine details to verify authenticity</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <LoadingSpinner size="large" />
              <p className="text-gray-500 mt-4">Verifying with regulatory databases...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Status Card */}
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(result.status)}`}>
                <div className="flex items-center mb-3">
                  {getStatusIcon(result.status)}
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold capitalize">{result.status}</h3>
                    <p className="text-sm opacity-75">
                      Confidence: {Math.round(result.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Verification Source:</span>
                  <span className="text-sm text-gray-900 uppercase">{result.verificationSource}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Batch Number:</span>
                  <span className="text-sm text-gray-900">{result.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Manufacturing Date:</span>
                  <span className="text-sm text-gray-900">{result.manufacturingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-600">Expiry Date:</span>
                  <span className="text-sm text-gray-900">{result.expiryDate}</span>
                </div>
              </div>

              {/* Warnings */}
              {result.warnings && result.warnings.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-yellow-800 mb-2">Warnings:</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {result.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Recommendations:</h4>
                <div className="text-sm text-blue-700">
                  {result.status === 'authentic' && (
                    <p>✅ This medicine appears to be authentic and safe to use (if not expired).</p>
                  )}
                  {result.status === 'suspicious' && (
                    <p>⚠️ Exercise caution. Verify with your pharmacist or contact the manufacturer.</p>
                  )}
                  {result.status === 'counterfeit' && (
                    <p>🚨 DO NOT USE. This appears to be a counterfeit medicine. Report to authorities.</p>
                  )}
                  {result.status === 'expired' && (
                    <p>⏰ DO NOT USE. This medicine has expired and may be ineffective or harmful.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How Medicine Verification Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">CDSCO Integration</h4>
            <p className="text-sm text-gray-600">
              Verify medicines against the Central Drugs Standard Control Organization database
            </p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">FDA Verification</h4>
            <p className="text-sm text-gray-600">
              Cross-reference with FDA approval numbers and regulatory status
            </p>
          </div>
          <div className="text-center">
            <div className="bg-purple-100 p-3 rounded-full inline-flex items-center justify-center mb-3">
              <AlertTriangle className="h-6 w-6 text-purple-600" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Counterfeit Detection</h4>
            <p className="text-sm text-gray-600">
              Advanced algorithms to detect suspicious patterns and counterfeit medicines
            </p>
          </div>
        </div>
      </div>

      {/* Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="bg-gray-900 px-4 py-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-medium flex items-center">
                <Camera className="h-4 w-4 mr-2" />
                Scan Medicine
              </h3>
              <button 
                onClick={() => !isScanning && setShowScanner(false)}
                className="text-gray-400 hover:text-white"
                disabled={isScanning}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 text-center">
              <div className="relative w-48 h-48 mx-auto mb-4 border-2 border-indigo-500 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                {isScanning ? (
                  <div className="absolute inset-0 bg-indigo-500 opacity-20 animate-pulse"></div>
                ) : (
                  <QrCode className="h-16 w-16 text-gray-400" />
                )}
                
                {/* Scanning line animation */}
                {isScanning && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_8px_2px_rgba(99,102,241,0.6)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                )}
              </div>
              
              <p className="text-gray-600 mb-6 font-medium h-6">
                {isScanning ? 'Extracting product ID...' : 'Position QR/Barcode within frame'}
              </p>
              
              <button
                onClick={simulateScan}
                disabled={isScanning}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:bg-indigo-400"
              >
                {isScanning ? 'Processing...' : 'Simulate Scan Capture'}
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes scan {
              0% { top: 0; }
              50% { top: 100%; }
              100% { top: 0; }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default AuthenticityChecker;