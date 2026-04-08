import React, { useEffect, useState } from 'react';
import { Pill, Search, LogOut, ArrowLeft, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChatStore } from '../stores/chatStore';
import { searchMedicines } from '../data/medicines';
import MedicineList from '../components/medicine/MedicineList';
import ChatInterface from '../components/chat/ChatInterface';
import SideNav from '../components/layout/SideNav';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const { 
    activeConversation, 
    createConversation,
    selectedMedicine,
    selectMedicine
  } = useChatStore();
  
  useEffect(() => {
    if (!activeConversation) {
      createConversation();
    }
  }, [activeConversation, createConversation]);

  const allFilteredMedicines = searchMedicines(searchQuery).filter(med => 
    filterCategory === 'All' ? true : med.category === filterCategory
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden font-sans">
      <SideNav />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center">
            <div className="flex items-center text-primary-600 mr-6">
              <Pill size={24} className="mr-2" />
              <h1 className="text-xl font-bold tracking-tight">PharmaVault</h1>
            </div>
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-bold tracking-wide">
                {user?.role.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right mr-4 hidden sm:block">
              <p className="font-medium text-sm text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Main Content Area (Expands fully when no medicine is selected) */}
          <div className={`flex flex-col h-full bg-gray-50 transition-all duration-300 ${selectedMedicine ? 'w-full lg:w-1/3 border-r hidden lg:flex' : 'w-full'} shadow-inner`}>
            
            <div className="p-6 bg-white border-b border-gray-200 z-10 shadow-sm relative">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Medicine Directory</h2>
                  <p className="text-sm text-gray-500 mt-1">Browse, search and verify authentic medications.</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, brand, or ingredients (NLP ready)..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-shadow shadow-sm"
                  />
                </div>
                
                <div className="relative">
                  <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none appearance-none bg-white shadow-sm font-medium text-gray-700"
                  >
                    <option value="All">All Categories</option>
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Analgesic">Pain Relief</option>
                    <option value="Antidiabetic">Diabetes</option>
                    <option value="Statin">Heart/Statin</option>
                    <option value="ACE Inhibitor">Blood Pressure</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Mental Health">Mental Health</option>
                    <option value="Gastrointestinal">Gastrointestinal</option>
                  </select>
                </div>
              </div>
            </div>
            
            <MedicineList 
              medicines={allFilteredMedicines} 
              selectedMedicine={selectedMedicine}
              onSelectMedicine={selectMedicine}
              isGrid={!selectedMedicine}
            />
          </div>
          
          {/* Slide-over Right Column - Chat Interface & Details Modal */}
          {selectedMedicine && (
            <div className={`absolute lg:relative inset-0 lg:inset-auto z-20 flex-1 flex flex-col overflow-hidden bg-white shadow-2xl lg:shadow-none animate-in slide-in-from-right lg:animate-none`}>
               {/* Mobile Header allowing user to go back to grid */}
               <div className="lg:hidden p-4 bg-white border-b border-gray-200 flex items-center shadow-sm">
                 <button 
                  onClick={() => selectMedicine(null)}
                  className="flex items-center text-primary-600 hover:text-primary-800 font-medium px-2 py-1 bg-primary-50 rounded-lg mr-4"
                 >
                   <ArrowLeft size={18} className="mr-1" />
                   Back to Directory
                 </button>
                 <span className="font-bold text-gray-900 truncate">Consult AI Assistant</span>
               </div>
               
               <ChatInterface />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;