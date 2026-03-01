"use client";

import { useState } from "react";
import QRCode from "qrcode.react";
import { motion } from "framer-motion";
import { VasosPremios } from "@/components/VasosPremios";

const CARTAS_BARAJA = [
  "1Oros", "2Oros", "3Oros", "4Oros", "5Oros",
  "6Oros", "7Oros", "10Oros", "SotaOros", "CaballoOros",
  "1Copas", "2Copas", "3Copas", "4Copas", "5Copas",
  "6Copas", "7Copas", "10Copas", "SotaCopas", "CaballoCopas",
  "1Espadas", "2Espadas", "3Espadas", "4Espadas", "5Espadas",
  "6Espadas", "7Espadas", "10Espadas", "SotaEspadas", "CaballoEspadas",
  "1Bastos", "2Bastos", "3Bastos", "4Bastos", "5Bastos",
  "6Bastos", "7Bastos", "10Bastos", "SotaBastos", "CaballoBastos",
];

export default function HostPage() {
  const [gameCode] = useState("PKN123");
  const [cartasCantadas, setCartasCantadas] = useState<string[]>([]);
  const [jugadoresConectados] = useState([
    { id: 1, nombre: "Juan", avatar: "👨‍🦱", saldo: 95 },
    { id: 2, nombre: "María", avatar: "👩‍🦰", saldo: 100 },
    { id: 3, nombre: "Carlos", avatar: "👨‍🦲", saldo: 100 },
  ]);

  const vasos = [
    { premio: "Centro" as const, monto: 15 },
    { premio: "Estampa" as const, monto: 15 },
    { premio: "Esquina" as const, monto: 15 },
    { premio: "Full" as const, monto: 15 },
    { premio: "Poker" as const, monto: 15 },
    { premio: "Pokino" as const, monto: 15 },
  ];

  const cantarCarta = (carta: string) => {
    if (!cartasCantadas.includes(carta)) {
      setCartasCantadas([...cartasCantadas, carta]);
    }
  };

  const qrValue = `https://pokino.local/player?code=${gameCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA 1: QR y Código */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📱 QR Jugadores</h2>
          <div className="bg-gray-100 p-4 rounded-lg mb-4 flex justify-center">
            <QRCode value={qrValue} size={200} level="H" includeMargin={true} />
          </div>
          <p className="text-center text-lg font-bold text-gray-700 uppercase mb-6">
            Código: <span className="text-yellow-500">{gameCode}</span>
          </p>
          
          {/* Lista de Jugadores */}
          <h3 className="text-lg font-bold text-gray-900 mb-3">Jugadores ({jugadoresConectados.length})</h3>
          <div className="space-y-2">
            {jugadoresConectados.map((j) => (
              <div key={j.id} className="flex items-center justify-between p-3 bg-gray-100 rounded">
                <span className="text-2xl">{j.avatar}</span>
                <span className="font-semibold">{j.nombre}</span>
                <span className="text-green-600 font-bold">{j.saldo} 🪙</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* COLUMNA 2: VASOS y CARTAS */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Vasos de Premios */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🏆 Vasos de Premios</h2>
            <VasosPremios vasos={vasos} />
          </div>

          {/* Cartas Cantadas */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">🃏 Cartas Cantadas ({cartasCantadas.length})</h2>
              <button
                onClick={() => setCartasCantadas([])}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Limpiar
              </button>
            </div>
            <div className="h-24 bg-gray-100 rounded-lg p-3 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {cartasCantadas.map((carta, idx) => (
                  <div key={idx} className="bg-blue-500 text-white px-3 py-1 rounded">
                    {carta}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Baraja para Cantar */}
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎴 Baraja (Toca para cantar)</h2>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {CARTAS_BARAJA.map((carta) => (
                <motion.button
                  key={carta}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => cantarCarta(carta)}
                  disabled={cartasCantadas.includes(carta)}
                  className={`p-2 rounded font-bold text-sm transition ${
                    cartasCantadas.includes(carta)
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-50"
                      : "bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 hover:shadow-lg"
                  }`}
                >
                  {carta}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
