import React from 'react';
import { Medicine } from '../../types';
import { AlertCircle, ShieldCheck, QrCode, ArrowRight } from 'lucide-react';

interface MedicineListProps {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  onSelectMedicine: (medicine: Medicine) => void;
  isGrid?: boolean;
}

const MedicineList: React.FC<MedicineListProps> = ({ 
  medicines, 
  selectedMedicine,
  onSelectMedicine,
  isGrid = false
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
      {medicines.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-200">
          <AlertCircle size={48} className="text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-900">No medicines found</p>
          <p className="text-sm">Try tweaking your search terms or filters.</p>
        </div>
      ) : (
        <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {medicines.map(medicine => (
            <div 
              key={medicine.id}
              className={`bg-white rounded-xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden flex ${
                isGrid ? 'flex-col' : 'flex-row items-center'
              } ${
                selectedMedicine?.id === medicine.id
                  ? 'ring-2 ring-primary-500 border-primary-200'
                  : 'border-gray-200'
              }`}
            >
              <div className={`${isGrid ? 'w-full h-48' : 'w-24 h-24 p-2'} relative bg-gray-100 flex-shrink-0`}>
                <img 
                  src={medicine.imageUrl || 'https://images.pexels.com/photos/159211/headache-pain-pills-medication-159211.jpeg'} 
                  alt={medicine.name}
                  className={`w-full h-full object-cover ${isGrid ? '' : 'rounded-lg'}`}
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  {medicine.inStock ? (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-green-500 text-white shadow-sm">
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-500 text-white shadow-sm">
                      Out of Stock
                    </span>
                  )}
                </div>
                {/* Verified Badge */}
                <div className="absolute top-3 left-3">
                   <div className="bg-white/90 backdrop-blur pointer-events-none px-2 py-1 rounded text-xs font-bold text-blue-700 shadow-sm flex items-center">
                     <ShieldCheck size={14} className="mr-1" /> Verified
                   </div>
                </div>
              </div>
              
              <div className={`flex flex-col flex-1 ${isGrid ? 'p-5' : 'p-4'}`}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{medicine.name}</h3>
                    <p className="text-sm text-primary-600 font-medium">{medicine.category}</p>
                  </div>
                  <span className="font-bold text-gray-900 border-b-2 border-primary-500 pb-0.5">₹{medicine.price.toFixed(2)}</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-4 line-clamp-2 mt-2 flex-grow">
                  {medicine.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-3 mt-auto">
                  <span className="font-medium truncate pr-2 max-w-[120px]">{medicine.manufacturer}</span>
                </div>

                <div className="flex gap-2 mt-4">
                  <button 
                    onClick={() => onSelectMedicine(medicine)}
                    className="flex-1 bg-gray-50 hover:bg-primary-50 text-primary-700 font-medium py-2 rounded-lg transition-colors border border-gray-200 hover:border-primary-200 flex justify-center items-center text-sm"
                  >
                    View Details
                    <ArrowRight size={16} className="ml-1.5" />
                  </button>
                  <button 
                    title="Scan QR"
                    onClick={() => alert(`QR functionality for ${medicine.name} activated!`)}
                    className="bg-gray-50 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors border border-gray-200 flex justify-center items-center"
                  >
                    <QrCode size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicineList;