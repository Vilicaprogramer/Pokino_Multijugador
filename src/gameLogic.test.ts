import { verificarPremios } from "./gameLogic";
import { Carton } from "./types";

describe("verificarPremios", () => {
  const makeCarton = (vals: number[][]): Carton => {
    return {
      filas: vals.map((row) => row.map((n) => `C${n}`)),
    };
  };

  it("detecta centro", () => {
    const carton = makeCarton([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ]);
    const cartasCantadas = ["C13"]; // central
    const res = verificarPremios(carton, cartasCantadas);
    expect(res.centro).toBeTruthy();
    expect(res.pokino).toBeFalsy();
  });

  it("detecta estampa y esquina y full+pokino vertical", () => {
    // construimos un carton con números fáciles de reconocer
    const carton = makeCarton([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ]);
    // marcamos las cuatro esquinas (esquina), el bloque 0,0-1,1 (estampa) y
    // además la columna 2 para provocar pokino vertical.
    const cartasCantadas = ["C1", "C5", "C21", "C25", "C2", "C7", "C12", "C17", "C22"];
    const res = verificarPremios(carton, cartasCantadas);
    expect(res.esquina).toBeTruthy();
    expect(res.estampa).toBeTruthy();
    expect(res.pokino).toBeTruthy();
    expect(res.full).toBeFalsy();
  });

  it("detecta poker en la primera fila y full en la segunda", () => {
    const carton = makeCarton([
      [1, 2, 3, 4, 5],
      [6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15],
      [16, 17, 18, 19, 20],
      [21, 22, 23, 24, 25],
    ]);
    const cartasCantadas = ["C1", "C2", "C3", "C4", "C6", "C7", "C8", "C9", "C10"];
    const res = verificarPremios(carton, cartasCantadas);
    expect(res.poker).toBeTruthy();
    expect(res.full).toBeTruthy();
  });

});
