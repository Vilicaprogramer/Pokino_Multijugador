"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const CARTON_EJEMPLO = [
  ["1Oros", "2Copas", "3Espadas", "4Bastos", "5Oros"],
  ["6Copas", "7Espadas", "10Bastos", "SotaOros", "CaballoCopas"],
  ["1Bastos", "2Espadas", "3", "4Copas", "5Espadas"],
  ["6Bastos", "7Copas", "10Espadas", "SotaBastos", "CaballoEspadas"],
  ["1Copas", "2Bastos", "3Copas", "4Espadas", "5Bastos"],
];

export default function PlayerPage() {
  const [marcadas, setMarcadas] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [cartasCantadas] = useState(["1Oros", "2Copas", "3Espadas"]);

  const toggleMarca = (row: number, col: number) => {
    const cartaEnPosicion = CARTON_EJEMPLO[row][col];
    // Solo permitir marcar si el host ha cantado esa carta
    if (cartasCantadas.includes(cartaEnPosicion)) {
      const newMarcadas = marcadas.map((r) => [...r]);
      newMarcadas[row][col] = !newMarcadas[row][col];
      setMarcadas(newMarcadas);
    }
  };

  const contarMarcadas = marcadas.reduce(
    (acc, row) => acc + row.filter((m) => m).length,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="bg-white rounded-t-2xl p-4 shadow-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center">🎮 Mi Cartón</h1>
          <p className="text-center text-sm text-gray-600 mt-2">
            Marcadas: <span className="font-bold text-blue-600">{contarMarcadas}/25</span>
          </p>
        </div>

        {/* Cartón 5x5 */}
        <div className="bg-white rounded-b-2xl p-4 shadow-lg">
          <div className="grid grid-cols-5 gap-2">
            {CARTON_EJEMPLO.map((row, rowIdx) =>
              row.map((carta, colIdx) => {
                const esMarcable = cartasCantadas.includes(carta);
                const estaMarcada = marcadas[rowIdx][colIdx];

                return (
                  <motion.button
                    key={`${rowIdx}-${colIdx}`}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleMarca(rowIdx, colIdx)}
                    disabled={!esMarcable}
                    className={`aspect-square rounded-lg font-bold text-xs p-2 transition ${
                      estaMarcada
                        ? "bg-green-500 text-white shadow-lg"
                        : esMarcable
                          ? "bg-blue-100 text-blue-900 border-2 border-blue-400"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {estaMarcada && rowIdx === 2 && colIdx === 2 && "✓"}
                    {estaMarcada && (rowIdx === 0 || rowIdx === 4 || colIdx === 0 || colIdx === 4) && "✓"}
                    {!estaMarcada && (
                      <div className="text-center break-words">
                        {carta.length > 4 ? carta.substring(0, 3) : carta}
                      </div>
                    )}
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 bg-white/20 rounded-lg p-4 text-white text-center">
          <p className="text-sm">
            Solo puedes marcar cartas que el host haya cantado.
          </p>
          <p className="text-xs mt-2 opacity-80">Código: PKN123</p>
        </div>
      </motion.div>
    </div>
  );
}
