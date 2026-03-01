"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-6xl font-bold text-white mb-4">🎰 Pokino Live</h1>
        <p className="text-xl text-gray-200 mb-12">
          El juego multijugador de cartas tipo Kahoot
        </p>

        <div className="flex gap-8 justify-center">
          <Link href="/host">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold rounded-lg shadow-lg text-lg"
            >
              🖥️ Soy Host (Pantalla)
            </motion.button>
          </Link>

          <Link href="/player">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg text-lg"
            >
              📱 Soy Jugador (Móvil)
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
