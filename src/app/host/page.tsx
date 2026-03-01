"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
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

interface Player {
  id: string;
  nombre: string;
  avatar: string;
  saldo: number;
}

export default function HostPage() {
  const [gameCode] = useState("PKN123");
  const [cartasCantadas, setCartasCantadas] = useState<string[]>([]);
  const [jugadores, setJugadores] = useState<Player[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [conectado, setConectado] = useState(false);

  useEffect(() => {
    // Conectar al servidor Socket.io usando la misma origen
    const socketUrl = typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
    const newSocket = io(socketUrl, {
      path: "/socket.io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Conectado al servidor");
      setConectado(true);

      // Notificar que soy Host
      newSocket.emit("hostJoined", { gameCode });
    });

    newSocket.on("gameStateUpdated", (state) => {
      setCartasCantadas(state.cartasCantadas);
      const playersArray = Object.values(state.players) as Player[];
      setJugadores(playersArray);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor");
      setConectado(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [gameCode]);

  const cantarCarta = (carta: string) => {
    if (socket && !cartasCantadas.includes(carta)) {
      socket.emit("cantarCarta", carta);
    }
  };

  const limpiarCartas = () => {
    if (socket) {
      socket.emit("limpiarCartas");
    }
  };

  const vasos = [
    { premio: "Centro" as const, monto: 15 },
    { premio: "Estampa" as const, monto: 15 },
    { premio: "Esquina" as const, monto: 15 },
    { premio: "Full" as const, monto: 15 },
    { premio: "Poker" as const, monto: 15 },
    { premio: "Pokino" as const, monto: 15 },
  ];

  // use current origin so QR works both locally and in codespace
  const qrValue =
    typeof window !== "undefined"
      ? `${window.location.origin}/player?code=${gameCode}`
      : `http://localhost:3000/player?code=${gameCode}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Status */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">🎰 Pokino Live - Host</h1>
        <div className={`px-4 py-2 rounded-full font-bold ${conectado ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
          {conectado ? "✅ Conectado" : "❌ Desconectando..."}
        </div>
      </div>

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
          <h3 className="text-lg font-bold text-gray-900 mb-3">Jugadores ({jugadores.length})</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {jugadores.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Esperando jugadores...</p>
            ) : (
              jugadores.map((j) => (
                <motion.div 
                  key={j.id} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gray-100 rounded"
                >
                  <span className="text-2xl">{j.avatar}</span>
                  <span className="font-semibold flex-1 ml-2">{j.nombre}</span>
                  <span className="text-green-600 font-bold">{j.saldo} 🪙</span>
                </motion.div>
              ))
            )}
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
                onClick={limpiarCartas}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Limpiar
              </button>
            </div>
            <div className="h-24 bg-gray-100 rounded-lg p-3 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {cartasCantadas.map((carta, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-blue-500 text-white px-3 py-1 rounded font-semibold"
                  >
                    {carta}
                  </motion.div>
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
