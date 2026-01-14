import React from 'react';
import { Medicine } from '../../types';
import { Check, AlertCircle } from 'lucide-react';

interface MedicineListProps {
  medicines: Medicine[];
  selectedMedicine: Medicine | null;
  onSelectMedicine: (medicine: Medicine) => void;
}

const MedicineList: React.FC<MedicineListProps> = ({ 
  medicines, 
  selectedMedicine,
  onSelectMedicine
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {medicines.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No medicines found
        </div>
      ) : (
        <ul className="divide-y divide-gray-100">
          {medicines.map(medicine => (
            <li key={medicine.id}>
              <button
                onClick={() => onSelectMedicine(medicine)}
                className={`w-full text-left px-4 py-3 transition-colors ${
                  selectedMedicine?.id === medicine.id
                    ? 'bg-primary-50 border-l-4 border-primary-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img 
                      src={medicine.imageUrl} 
                      alt={medicine.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{medicine.name}</h3>
                        <p className="text-sm text-gray-600">{medicine.category}</p>
                      </div>
                      
                      <div className="flex items-center">
                        {medicine.inStock ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            <Check size={12} className="mr-1" />
                            In Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            <AlertCircle size={12} className="mr-1" />
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-1 flex justify-between text-sm">
                      <span className="text-gray-500">{medicine.manufacturer}</span>
                      <span className="font-medium text-gray-900">₹{medicine.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MedicineList;