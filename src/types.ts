// Core data schemas for Pokino Live game

// Represent a single card; can be a string like "1Oros", "SotaCopas" etc.
export type Carta = string;

// A carton is a 5x5 grid of cards
export interface Carton {
  // 5 rows of 5 cards each
  filas: Carta[][]; // filas[row][col]
}

// The six possible prizes in a round
export type Premio =
  | "Centro"
  | "Estampa"
  | "Esquina"
  | "Full"
  | "Poker"
  | "Pokino";

// Result of validating a carton against the called cards
export interface ResultadoPremios {
  centro: boolean;
  estampa: boolean;
  esquina: boolean;
  full: boolean;
  poker: boolean;
  pokino: boolean;
}

// State of the overall game/partida
export interface EstadoPartida {
  id: string;
  hostId: string;
  jugadores: Jugador[];
  cartasCantadas: Carta[];
  botes: Record<Premio, number>; // value in each vaso
  acumulados: Record<Premio, number>; // carried over when prize wasn't claimed
  rondaEnCurso: boolean;
}

// Information for each player
export interface Jugador {
  id: string;
  nombre: string;
  avatarUrl?: string;
  saldo: number; // fichas disponibles
  carton?: Carton; // assigned when joining la ronda
  marcadas?: boolean[][]; // 5x5 grid of marks (true=marcada)
}
