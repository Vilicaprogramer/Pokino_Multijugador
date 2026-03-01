import React from "react";

interface Props {
  visible: boolean;
  onContinue: () => void;
  onEnd: () => void;
}

export const FinRondaModal: React.FC<Props> = ({ visible, onContinue, onEnd }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
        <h2 className="text-2xl font-bold mb-4">Fin de la ronda</h2>
        <p className="mb-6">El pokino ha sido cantado.</p>
        <div className="flex justify-between">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={onContinue}
          >
            Continuar partida
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={onEnd}
          >
            Terminar
          </button>
        </div>
      </div>
    </div>
  );
};
