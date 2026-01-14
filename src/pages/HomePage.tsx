import React, { useEffect, useState } from 'react';
import { Pill, MessageSquare, Search, LogOut, Plus, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useChatStore } from '../stores/chatStore';
import { searchMedicines } from '../data/medicines';
import { questionTemplates } from '../data/questions';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import MedicineList from '../components/medicine/MedicineList';
import ChatInterface from '../components/chat/ChatInterface';
import SideNav from '../components/layout/SideNav';

const HomePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    activeConversation, 
    createConversation,
    selectedMedicine,
    selectMedicine
  } = useChatStore();
  
  // Create an initial conversation if none exists
  useEffect(() => {
    if (!activeConversation) {
      createConversation();
    }
  }, [activeConversation, createConversation]);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Side Navigation */}
      <SideNav />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center text-primary-600 mr-6">
              <Pill size={24} className="mr-2" />
              <h1 className="text-xl font-bold">PharmaVault</h1>
            </div>
            
            <div className="hidden md:flex items-center text-sm text-gray-500">
              <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-medium">
                {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="text-right mr-4">
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <button 
              onClick={logout}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Medicines */}
          <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold mb-3">Medications</h2>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
            
            <MedicineList 
              medicines={searchMedicines(searchQuery)} 
              selectedMedicine={selectedMedicine}
              onSelectMedicine={selectMedicine}
            />
          </div>
          
          {/* Right Column - Chat Interface */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {selectedMedicine ? (
              <ChatInterface />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="max-w-md text-center">
                  <div className="bg-primary-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
                    <Pill size={28} className="text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Select a Medicine</h2>
                  <p className="text-gray-600 mb-4">
                    Choose a medicine from the list on the left to view information and ask questions about it.
                  </p>
                  <p className="text-sm text-gray-500">
                    You can search for specific medicines or browse the available options.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;