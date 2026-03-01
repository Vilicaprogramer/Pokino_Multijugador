# Pokino Live (Prototipo)

Juego web multijugador inspirado en Kahoot y en el "Pokino" tradicional.

## Arquitectura general

- **Frontend**: Next.js con React + Tailwind CSS. Animaciones con `framer-motion`.
- **Backend/Realtime**: Socket.io (o Supabase Realtime) para sincronizar host y jugadores.
- **Estado**: el servidor mantiene `EstadoPartida` y replica los eventos en tiempo real.

## Esquemas de datos (TypeScript)

Los tipos básicos están definidos en `src/types.ts`:

```ts
export type Carta = string;

export interface Carton {
  filas: Carta[][]; // 5x5
}

export type Premio =
  | "Centro"
  | "Estampa"
  | "Esquina"
  | "Full"
  | "Poker"
  | "Pokino";

export interface ResultadoPremios {
  centro: boolean;
  estampa: boolean;
  esquina: boolean;
  full: boolean;
  poker: boolean;
  pokino: boolean;
}

export interface EstadoPartida { ... }
export interface Jugador { ... }
```

## Lógica de validación

La función `verificarPremios(carton, cartasCantadas)` en `src/gameLogic.ts` examina un cartón contra las cartas ya cantadas y devuelve qué premios se han completado. El pokino corta la ronda.

```ts
import { Carton, ResultadoPremios } from "./types";

export function verificarPremios(
  carton: Carton,
  cartasCantadas: string[]
): ResultadoPremios {
  // ... implementación (ver fuente)
}
```

## Gestión de botes y fin de ronda

Cada ronda comienza con 100 fichas por jugador, 5 fichas depositadas en cada uno de los 6 vasos.
Si al finalizar la ronda algún bote no se reclamó, se acumula para la siguiente. La utilidad
`manejarFinDeRonda` en el mismo fichero muestra cómo resetear o terminar la partida.

## Componente "Vasos de Premios"

El componente en `src/components/VasosPremios.tsx` renderiza los 6 vasos, muestra montos e
incluye un resaltado cuando un jugador gana uno.

```tsx
<VasosPremios
  vasos={[
    { premio: "Centro", monto: 5 },
    { premio: "Estampa", monto: 5, ganado: true },
    // ... otros vasos
  ]}
/>
```

El estilo utiliza Tailwind y permite interacción táctil para el host.

## Flujo de fin de ronda

1. El `Host` marca el Pokino o se detecta automáticamente desde el servidor.
2. Se calcula el ganador de cada vaso utilizando `verificarPremios` para cada jugador.
3. El host decide entre:
   - **Continuar Partida**: limpia los cartones, reinicia el mazo y soles mestas; botes no
     reclamados se agregan a `acumulados` (guardados en `EstadoPartida`).
   - **Terminar**: persiste el estado final y muestra el resumen de ganadores.

Esta lógica se puede implementar como un modal o pantalla con dos botones que llaman a las
funciones correspondientes en el backend.


---

Se trata de un punto de partida; la implementación completa requerirá rutas de Next.js,
websockets y diseño de UI adicionales.
