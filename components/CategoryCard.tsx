
import React from 'react';
import { LucideIcon, ChevronRight } from 'lucide-react';

interface CategoryCardProps {
  icon: LucideIcon;
  label: string;
  desc: string;
  color: string;
  onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ icon: Icon, label, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white p-6 rounded-[2.5rem] border border-purple-50 flex items-center gap-5 hover:shadow-xl hover:shadow-purple-50/50 transition-all duration-300 text-left group"
  >
    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${color} transition-transform group-hover:scale-110 shadow-sm`}>
      <Icon size={30} />
    </div>
    <div className="flex-1">
      <h4 className="font-black text-lg text-gray-800 tracking-tight">{label}</h4>
      <p className="text-xs text-gray-400 font-medium mt-0.5">{desc}</p>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
      <ChevronRight size={20} />
    </div>
  </button>
);
