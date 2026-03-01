import { Carton, ResultadoPremios } from "./types";

/**
 * Dada una tarjeta de 5x5 y un conjunto de cartas cantadas,
 * devuelve un objeto indicando qué premios están cumplidos.
 *
 * Las definiciones son las especificadas en el enunciado:
 * - Centro: solo está marcada la carta central (2,2).
 * - Estampa: existe un bloque de 2x2 en alguna esquina totalmente marcado.
 * - Esquina: están marcadas las cuatro esquinas exteriores.
 * - Full: línea horizontal 1 (segunda desde arriba) completa.
 * - Poker: cuatro cartas de la primera línea horizontal (columnas 0..3).
 * - Pokino: cualquier línea de 5 cartas (horiz. excepto full, vert. o diagonal) completa.
 *
 * El marcado se determina por la intersección del cartón con cartasCantadas.
 */
export function verificarPremios(
  carton: Carton,
  cartasCantadas: string[]
): ResultadoPremios {
  // construir matriz booleana de marcadas
  const marcadas: boolean[][] = Array.from({ length: 5 }, (_, r) =>
    Array.from({ length: 5 }, (_, c) =>
      cartasCantadas.includes(carton.filas[r][c])
    )
  );

  const centro = marcadas[2][2] === true;

  // estampa: cualquiera de los 4 bloques 2x2
  const esquinas2x2: [number, number][][] = [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 3],
      [0, 4],
      [1, 3],
      [1, 4],
    ],
    [
      [3, 0],
      [3, 1],
      [4, 0],
      [4, 1],
    ],
    [
      [3, 3],
      [3, 4],
      [4, 3],
      [4, 4],
    ],
  ];
  const estampa = esquinas2x2.some((coords) =>
    coords.every(([r, c]) => marcadas[r][c])
  );

  // esquina: cuatro vértices del carton
  const esquina =
    marcadas[0][0] &&
    marcadas[0][4] &&
    marcadas[4][0] &&
    marcadas[4][4];

  // full: segunda fila (índice 1) completamente marcada
  const full = marcadas[1].every(Boolean);

  // poker: primeras cuatro cartas de la fila 0
  const poker = marcadas[0].slice(0, 4).every(Boolean);

  // pokino: cualquier línea de 5
  let pokino = false;

  // horizontales
  for (let r = 0; r < 5; r++) {
    if (r === 1) continue; // fila full no cuenta para pokino
    if (marcadas[r].every(Boolean)) {
      pokino = true;
    }
  }
  // verticales
  for (let c = 0; c < 5; c++) {
    let ok = true;
    for (let r = 0; r < 5; r++) {
      if (!marcadas[r][c]) {
        ok = false;
        break;
      }
    }
    if (ok) pokino = true;
  }
  // diagonales
  if ([0, 1, 2, 3, 4].every((i) => marcadas[i][i])) pokino = true;
  if ([0, 1, 2, 3, 4].every((i) => marcadas[i][4 - i])) pokino = true;

  return { centro, estampa, esquina, full, poker, pokino };
}

/**
 * Maneja el fin de una ronda. Devuelve un nuevo estado de partida actualizado según la decisión.
 *
 * @param estado Estado de partida actual
 * @param opcion "continuar" para iniciar nueva ronda (resetea cartones y cartas cantadas, acumula botes no reclamados)
 *                "terminar" para cerrar la partida y devolver el estado final (se podría persistir afuera)
 */
export function manejarFinDeRonda(
  estado: any,
  opcion: "continuar" | "terminar"
): any {
  if (opcion === "terminar") {
    // el llamado exterior debería guardar el estado
    return { ...estado, rondaEnCurso: false };
  }
  // continuar: resetear datos de ronda pero conservar acumulados
  const nuevoBotes: Record<string, number> = { ...estado.botes };
  const acumulados: Record<string, number> = { ...estado.acumulados };

  // Si un premio no fue ganado, su valor se traslada al acumulado
  // (esto debería hacerse en el momento de verificar premios, pero se ilustra aquí)
  Object.keys(nuevoBotes).forEach((p) => {
    if (nuevoBotes[p] > 0) {
      acumulados[p] = (acumulados[p] || 0) + nuevoBotes[p];
      nuevoBotes[p] = 0;
    }
  });

  const jugadores = estado.jugadores.map((j: any) => ({
    ...j,
    carton: undefined,
    marcadas: undefined,
  }));

  return {
    ...estado,
    rondaEnCurso: true,
    cartasCantadas: [],
    botes: nuevoBotes,
    acumulados,
    jugadores,
  };
}
