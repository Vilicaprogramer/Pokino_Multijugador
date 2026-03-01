import React from "react";
import { Premio } from "../types";

interface Vaso {
  premio: Premio;
  monto: number;
  // flag para resaltar cuando alguien lo gana
  ganado?: boolean;
}

interface Props {
  vasos: Vaso[]; // se asume longitud 6
  onClickVaso?: (premio: Premio) => void; // opcional: para pruebas / acciones
}

export const VasosPremios: React.FC<Props> = ({ vasos, onClickVaso }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {vasos.map((v) => (
        <div
          key={v.premio}
          className={`relative flex flex-col items-center justify-center p-3 border rounded-xl shadow-md transition-transform duration-300
            ${v.ganado ? "bg-yellow-300 scale-105" : "bg-white"}`}
          onClick={() => onClickVaso && onClickVaso(v.premio)}
        >
          {/* vaso icon */}
          <div className="w-12 h-12 bg-blue-500 rounded-full mb-2 flex items-center justify-center text-white font-bold">
            {v.monto}
          </div>
          <span className="text-sm font-semibold">{v.premio}</span>
          {v.ganado && (
            <div className="absolute inset-0 bg-yellow-200 opacity-50 rounded-xl"></div>
          )}
        </div>
      ))}
    </div>
  );
};
