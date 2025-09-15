import React from 'react';

interface SetCardProps {
  name: string;
  description: string;
  price: number;
  onSelect: () => void;
}

export const SetCard: React.FC<SetCardProps> = ({ name, description, price, onSelect }) => {
  return (
    <div className="border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
      <h3 className="text-2xl font-bold text-olive mb-2">{name}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <span className="text-xl font-semibold text-gray-800">₪{price}</span>
        <button 
          onClick={onSelect}
          className="bg-green-700 text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors"
        >
          בחר סט
        </button>
      </div>
    </div>
  );
};