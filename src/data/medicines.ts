import { Medicine } from '../types';

export const medicines: Medicine[] = [
  {
    id: 'med-001',
    name: 'Paracetamol',
    manufacturer: 'Acme Pharma',
    category: 'Analgesic',
    description: 'A common pain reliever and fever reducer.',
    dosage: 'Adults: 500-1000mg every 4-6 hours as needed (max 4g per day). Children: Dosage varies by age and weight.',
    sideEffects: [
      'Nausea',
      'Stomach pain',
      'Allergic reactions (rare)',
      'Liver damage (with overdose)'
    ],
    usedFor: [
      'Headache',
      'Fever',
      'Minor aches and pains',
      'Cold and flu symptoms',
      'Toothache'
    ],
    alternatives: ['Ibuprofen', 'Aspirin', 'Naproxen'],
    expiryDate: '2024-12-31',
    price: 25.50,
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/139398/thermometer-headache-pain-pills-139398.jpeg'
  },
  {
    id: 'med-002',
    name: 'Amoxicillin',
    manufacturer: 'MediLabs',
    category: 'Antibiotic',
    description: 'A penicillin antibiotic that fights bacteria in the body.',
    dosage: 'Adults: 250-500mg three times daily. Children: Dosage varies by weight.',
    sideEffects: [
      'Diarrhea',
      'Stomach pain',
      'Nausea',
      'Vomiting',
      'Rash',
      'Allergic reactions'
    ],
    usedFor: [
      'Bronchitis',
      'Pneumonia',
      'Ear infections',
      'Urinary tract infections',
      'Skin infections'
    ],
    alternatives: ['Azithromycin', 'Cephalexin', 'Doxycycline'],
    expiryDate: '2024-08-15',
    price: 149.99,
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg'
  },
  {
    id: 'med-003',
    name: 'Lisinopril',
    manufacturer: 'Heart Health Inc.',
    category: 'ACE Inhibitor',
    description: 'Used to treat high blood pressure and heart failure.',
    dosage: 'Adults: 10-40mg once daily. Start with lower dose and adjust as needed.',
    sideEffects: [
      'Dry cough',
      'Dizziness',
      'Headache',
      'Fatigue',
      'High potassium levels'
    ],
    usedFor: [
      'Hypertension (high blood pressure)',
      'Heart failure',
      'Post heart attack treatment',
      'Kidney protection in diabetes'
    ],
    alternatives: ['Enalapril', 'Ramipril', 'Losartan'],
    expiryDate: '2024-10-20',
    price: 299.50,
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/4021808/pexels-photo-4021808.jpeg'
  },
  {
    id: 'med-004',
    name: 'Metformin',
    manufacturer: 'DiaCare',
    category: 'Antidiabetic',
    description: 'First-line medication for the treatment of type 2 diabetes.',
    dosage: 'Adults: Start with 500mg twice daily with meals, may increase to 1000mg twice daily.',
    sideEffects: [
      'Nausea',
      'Vomiting',
      'Diarrhea',
      'Stomach pain',
      'Metallic taste',
      'Lactic acidosis (rare but serious)'
    ],
    usedFor: [
      'Type 2 diabetes',
      'Insulin resistance',
      'Polycystic ovary syndrome (off-label)'
    ],
    alternatives: ['Glyburide', 'Glipizide', 'Sitagliptin'],
    expiryDate: '2025-01-15',
    price: 199.99,
    inStock: false,
    imageUrl: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg'
  },
  {
    id: 'med-005',
    name: 'Atorvastatin',
    manufacturer: 'LipidCare Pharmaceuticals',
    category: 'Statin',
    description: 'Used to lower cholesterol and reduce the risk of heart disease.',
    dosage: 'Adults: 10-80mg once daily. Start with lower dose and adjust as needed.',
    sideEffects: [
      'Muscle pain',
      'Liver problems',
      'Digestive issues',
      'Headache',
      'Insomnia'
    ],
    usedFor: [
      'High cholesterol',
      'Prevention of heart disease',
      'Stroke prevention',
      'Coronary artery disease'
    ],
    alternatives: ['Rosuvastatin', 'Simvastatin', 'Pravastatin'],
    expiryDate: '2024-11-30',
    price: 399.99,
    inStock: true,
    imageUrl: 'https://images.pexels.com/photos/3683101/pexels-photo-3683101.jpeg'
  }
];

export const getMedicineById = (id: string): Medicine | undefined => {
  return medicines.find(med => med.id === id);
};

export const getMedicineByName = (name: string): Medicine | undefined => {
  return medicines.find(med => med.name.toLowerCase() === name.toLowerCase());
};

export const searchMedicines = (query: string): Medicine[] => {
  const searchTerm = query.toLowerCase();
  return medicines.filter(med => 
    med.name.toLowerCase().includes(searchTerm) || 
    med.category.toLowerCase().includes(searchTerm) ||
    med.manufacturer.toLowerCase().includes(searchTerm)
  );
};