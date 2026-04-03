import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';

type Props = {
  label: string;
  onClose: () => void;
};

export function TimerAlertModal({ label, onClose }: Props) {
  useEffect(() => {
    // Play sound when modal opens
    const audio = new Audio('/timer-alert.mp3');
    audio.play();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Minuteur terminé !</h3>
        <p className="text-gray-600 mb-6">{label} est terminé</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Arrêter l'alarme
        </button>
      </div>
    </div>
  );
}