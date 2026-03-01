const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();

app.use(cors());
app.use(express.json());

// Estado global del juego (definido temprano, usado en handlers más abajo)
let gameState = {
  gameCode: "PKN123",
  host: null,
  players: {},
  cartasCantadas: [],
  botes: {
    Centro: 0,
    Estampa: 0,
    Esquina: 0,
    Full: 0,
    Poker: 0,
    Pokino: 0,
  },
  rondaEnCurso: true,
};

// Preconfigure HTTP server variable for later
let httpServer;
let io;

// Prepare Next and only then mount routes + start listening
nextApp.prepare().then(() => {
  // attach Next handler as last middleware so app.get "/" won't override
  app.all("*", (req, res) => {
    return handle(req, res);
  });

  // create HTTP server now that middleware are set up
  httpServer = createServer(app);
  io = new Server(httpServer, {
    path: "/socket.io",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // register socket listeners once io exists
  io.on("connection", (socket) => {
    console.log(`✅ Usuario conectado: ${socket.id}`);

    // Host se conecta
    socket.on("hostJoined", (data) => {
      gameState.host = { id: socket.id, ...data };
      socket.join("host");
      console.log("🖥️ HOST conectado");

      // Enviar estado actual a todos
      io.emit("gameStateUpdated", gameState);
    });

    // Jugador se conecta
    socket.on("playerJoined", (data) => {
      if (gameState.gameCode === data.gameCode) {
        gameState.players[socket.id] = {
          id: socket.id,
          nombre: data.nombre || "Jugador",
          avatar: data.avatar || "👤",
          saldo: 100,
          carton: null,
          marcadas: Array(5)
            .fill(null)
            .map(() => Array(5).fill(false)),
        };
        socket.join("players");
        socket.emit("joinSuccess", { gameCode: gameState.gameCode });
        console.log(`📱 Jugador conectado: ${data.nombre}`);

        // Notificar al host de nuevo jugador
        io.to("host").emit("playerJoined", gameState.players[socket.id]);

        // Enviar estado actual
        io.emit("gameStateUpdated", gameState);
      } else {
        socket.emit("joinError", { message: "Código de juego inválido" });
      }
    });

    // Host canta una carta
    socket.on("cantarCarta", (carta) => {
      if (gameState.host?.id === socket.id) {
        if (!gameState.cartasCantadas.includes(carta)) {
          gameState.cartasCantadas.push(carta);
          console.log(`🎴 Carta cantada: ${carta}`);

          // Notificar a todos los jugadores
          io.to("players").emit("cartaCantada", carta);

          // Enviar estado actualizado
          io.emit("gameStateUpdated", gameState);
        }
      }
    });

    // Jugador marca un cartón
    socket.on("marcarCarta", (data) => {
      const player = gameState.players[socket.id];
      if (player && gameState.cartasCantadas.includes(data.carta)) {
        player.marcadas[data.row][data.col] = data.marked;
        console.log(`✓ ${player.nombre} marcó carta en [${data.row},${data.col}]`);

        // Enviar estado actualizado
        io.emit("gameStateUpdated", gameState);
      }
    });

    // Host limpia cartas cantadas
    socket.on("limpiarCartas", () => {
      if (gameState.host?.id === socket.id) {
        gameState.cartasCantadas = [];
        Object.keys(gameState.players).forEach((id) => {
          gameState.players[id].marcadas = Array(5)
            .fill(null)
            .map(() => Array(5).fill(false));
        });
        console.log("🔄 Cartas limpiadas");
        io.emit("gameStateUpdated", gameState);
      }
    });

    // Desconexión
    socket.on("disconnect", () => {
      if (gameState.host?.id === socket.id) {
        gameState.host = null;
        console.log("🖥️ Host desconectado");
      } else if (gameState.players[socket.id]) {
        const nombre = gameState.players[socket.id].nombre;
        delete gameState.players[socket.id];
        console.log(`📱 Jugador desconectado: ${nombre}`);
      }
      io.emit("gameStateUpdated", gameState);
    });
  });

  // register any HTTP routes not handled by Next (use /api paths to avoid conflict)
  app.get("/api/status", (req, res) => {
    res.json({ message: "Pokino Live Server", status: "running" });
  });

  app.get("/api/game-state", (req, res) => {
    res.json(gameState);
  });

  const PORT = process.env.PORT || 3000;
  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`⚠️ El puerto ${PORT} ya está en uso. Cierra cualquier instancia previa y vuelve a intentarlo.`);
    } else {
      console.error("Error del servidor:", err);
    }
    process.exit(1);
  });
  httpServer.listen(PORT, () => {
    console.log(`\n🚀 Servidor combinado escuchando en puerto ${PORT}`);
    console.log(`🔗 WebSocket activo en /socket.io`);
  });
});

