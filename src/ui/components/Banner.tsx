import React from 'react';

export const Banner = () => {
  return (
    <div className="bg-green-700 text-white py-20 px-6 rounded-lg shadow-lg text-center">
      <h2 className="text-4xl font-bold mb-4">ארבעת המינים בהנגשה אחרת</h2>
      <p className="text-lg mb-8">בחר סט מוכן מראש או בנה לך סט מותאם אישית</p>
      <div className="flex justify-center gap-4">
        <a
          href="/custom"
          className="bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-olive transition duration-300"
        >
          בנה סט מותאם אישית
        </a>
        <a
          href="/sets"
          className="text-olive font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300"
        >
          צפה בסטים
        </a>
      </div>
    </div>
  );
};