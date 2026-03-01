"use client";

import { useState, useEffect, Suspense } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const CARTON_EJEMPLO = [
  ["1Oros", "2Copas", "3Espadas", "4Bastos", "5Oros"],
  ["6Copas", "7Espadas", "10Bastos", "SotaOros", "CaballoCopas"],
  ["1Bastos", "2Espadas", "3", "4Copas", "5Espadas"],
  ["6Bastos", "7Copas", "10Espadas", "SotaBastos", "CaballoEspadas"],
  ["1Copas", "2Bastos", "3Copas", "4Espadas", "5Bastos"],
];

function PlayerContent() {
  const searchParams = useSearchParams();
  const gameCode = searchParams?.get("code") || "PKN123";
  
  const [marcadas, setMarcadas] = useState<boolean[][]>(
    Array(5).fill(null).map(() => Array(5).fill(false))
  );
  const [cartasCantadas, setCartasCantadas] = useState<string[]>([]);
  const [socket, setSocket] = useState<any>(null);
  const [conectado, setConectado] = useState(false);
  const [nombre, setNombre] = useState("");
  const [unido, setUnido] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Usar la URL actual para conectar al servidor
    const socketUrl = typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";

    console.log("🔌 Intentando conectar a origen actual:", socketUrl);

    const newSocket = io(socketUrl, {
      path: "/socket.io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("✅ Conectado al servidor");
      setConectado(true);
      setError("");
    });

    newSocket.on("joinSuccess", (data) => {
      console.log("✅ Te uniste al juego:", data);
      setUnido(true);
    });

    newSocket.on("joinError", (data) => {
      console.error("❌ Error al unirse:", data.message);
      setError(data.message);
    });

    newSocket.on("cartaCantada", (carta) => {
      console.log("🎴 Carta cantada:", carta);
      setCartasCantadas((prev) => {
        if (!prev.includes(carta)) {
          return [...prev, carta];
        }
        return prev;
      });
    });

    newSocket.on("gameStateUpdated", (state) => {
      setCartasCantadas(state.cartasCantadas);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor");
      setConectado(false);
    });

    newSocket.on("connect_error", (error: any) => {
      console.error("❌ Error de conexión:", error);
      setError("No se puede conectar al servidor");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const toggleMarca = (row: number, col: number) => {
    const cartaEnPosicion = CARTON_EJEMPLO[row][col];
    // Solo permitir marcar si el host ha cantado esa carta
    if (cartasCantadas.includes(cartaEnPosicion)) {
      const newMarcadas = marcadas.map((r) => [...r]);
      newMarcadas[row][col] = !newMarcadas[row][col];
      setMarcadas(newMarcadas);

      // Notificar al servidor
      if (socket) {
        socket.emit("marcarCarta", {
          row,
          col,
          carta: cartaEnPosicion,
          marked: newMarcadas[row][col],
        });
      }
    }
  };

  const handleUnirse = () => {
    if (nombre.trim() && socket) {
      socket.emit("playerJoined", {
        gameCode,
        nombre: nombre.trim(),
        avatar: "👤",
      });
    }
  };

  const contarMarcadas = marcadas.reduce(
    (acc, row) => acc + row.filter((m) => m).length,
    0
  );

  if (!unido) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl"
        >
          <h1 className="text-3xl font-bold text-center mb-6">🎮 Pokino Live</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tu nombre
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleUnirse()}
              placeholder="ej: Juan"
              className="w-full px-4 py-2 border-2 border-blue-400 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <p className="text-center text-sm text-gray-600 mb-4">
            Código del juego: <span className="font-bold text-yellow-600">{gameCode}</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleUnirse}
            disabled={!nombre.trim() || !conectado}
            className={`w-full py-3 rounded-lg font-bold text-lg transition ${
              conectado && nombre.trim()
                ? "bg-gradient-to-r from-green-400 to-blue-500 text-white cursor-pointer hover:shadow-lg"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {!conectado ? "⏳ Conectando..." : nombre.trim() ? "✅ Unirse al Juego" : "Ingresa tu nombre"}
          </motion.button>

          <p className="text-center text-xs text-gray-500 mt-4">
            {conectado ? "✅ Conectado al servidor" : "❌ Conectando al servidor..."}
          </p>
        </motion.div>
      </div>
    );
  }

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
          <p className="text-center text-xs text-gray-500 mt-1">
            Cartas cantadas: {cartasCantadas.length}
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
                        ? "bg-green-500 text-white shadow-lg scale-105"
                        : esMarcable
                          ? "bg-blue-100 text-blue-900 border-2 border-blue-400"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                    }`}
                  >
                    {estaMarcada ? "✓" : (
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
            ✅ Solo puedes marcar cartas que el host haya cantado.
          </p>
          <p className="text-xs mt-2 opacity-80">🎴 Cartas cantadas: {cartasCantadas.join(", ") || "Ninguna aún"}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Cargando...</div>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}
