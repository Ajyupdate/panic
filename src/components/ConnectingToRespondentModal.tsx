
import React from 'react';
import Image from 'next/image';

interface ConnectingToRespondentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectingToRespondentModal: React.FC<ConnectingToRespondentModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">Connecting to a Respondent</h2>
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <Image src="/login-pic.png" alt="Respondent" width={80} height={80} className="rounded-full" />
          </div>
          <p className="text-lg font-semibold">Respondent</p>
        </div>
        <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden mb-4">
          {/* Placeholder for map */}
          <Image src="/globe.svg" alt="Map" width={300} height={192} className="object-cover w-full h-full" />
        </div>
        <button
          onClick={onClose}
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ConnectingToRespondentModal;

