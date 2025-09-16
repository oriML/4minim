import React from 'react';

interface SetCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl: string; // New prop
  onSelect: () => void;
}

export const SetCard: React.FC<SetCardProps> = ({ name, description, price, imageUrl, onSelect }) => {
  return (
    <div 
      className="relative border rounded-lg p-6 bg-white shadow-lg hover:shadow-xl transition-shadow overflow-hidden h-64 flex flex-col justify-end"
      style={{ backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}
    >
      <div className="absolute inset-0 bg-black opacity-40"></div> {/* Overlay for text readability */}
      <div className="relative z-10 text-white">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <p className="mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-semibold">₪{price}</span>
          <button 
            onClick={onSelect}
            className="bg-green-700 text-white font-bold py-2 px-4 rounded-full hover:bg-opacity-90 transition-colors"
          >
            בחר סט
          </button>
        </div>
      </div>
    </div>
  );
};