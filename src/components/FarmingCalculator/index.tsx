import { useState } from "react";
import { WarzoneCalculator } from "../warzonecalculator";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

const FarmingCalculator = () => {
  const categorias = [
    { value: "gorda", text: "Gorda (40 XP)", xp: 40 },
    { value: "fea", text: "Fea (20 XP)", xp: 20 },
    { value: "extranjera", text: "extranjera (40 XP)", xp: 40 },
    { value: "novia", text: "Novia (1000 XP)", xp: 1000 },
    { value: "amiga", text: "Amiga (10 XP)", xp: 10 },
    { value: "normal", text: "Normal (10 XP)", xp: 10 },
    { value: "buena", text: "Buena (5 XP)", xp: 5 },
    { value: "top", text: "Top (200 XP)", xp: 200 },
  ];

  const penalizaciones = [
    { value: "none", text: "Sin penalización", factor: 1 },
    { value: "leve", text: "Leve (x0.5)", factor: 0.5 },
    { value: "media", text: "Media (x0.25)", factor: 0.25 },
    { value: "grave", text: "Grave (x0)", factor: 0 },
    { value: "ban", text: "Ban", factor: 0 },
  ];

  // Estados
  const [categoria, setCategoria] = useState("gorda");
  const [penalizacion, setPenalizacion] = useState("none");
  const [xpAcumulada, setXpAcumulada] = useState(0);
  const [historial, setHistorial] = useState<string[]>([]);
  const [conteo, setConteo] = useState<Record<string, number>>({});
  const [multiplicadores, setMultiplicadores] = useState<number[]>([]);

  // Calcular XP
  const calcularXP = () => {
    const categoriaSeleccionada = categorias.find(
      (cat) => cat.value === categoria
    );
    const penalizacionSeleccionada = penalizaciones.find(
      (pen) => pen.value === penalizacion
    );

    if (!categoriaSeleccionada || !penalizacionSeleccionada) return;

    if (penalizacion === "ban") {
      setHistorial((prev) => [
        `¡Baneado del servidor! ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
      return;
    }

    const xpBase = categoriaSeleccionada.xp;
    const factor = penalizacionSeleccionada.factor;
    const xpGanada = xpBase * factor;

    setXpAcumulada((prev) => prev + xpGanada);
    setHistorial((prev) => [
      `${categoriaSeleccionada.text} con penalización ${
        penalizacionSeleccionada.text
      }: ${xpGanada} XP (${new Date().toLocaleTimeString()})`,
      ...prev,
    ]);

    setConteo((prev) => ({
      ...prev,
      [categoriaSeleccionada.value]:
        (prev[categoriaSeleccionada.value] || 0) + 1,
    }));

    setMultiplicadores((prev) => [...prev, factor]);
  };

  // Calcular promedio de multiplicador
  const calcularPromedio = () => {
    if (multiplicadores.length === 0) return "N/A";
    const suma = multiplicadores.reduce((acc, val) => acc + val, 0);
    return (suma / multiplicadores.length).toFixed(2);
  };

  // Calcular cuántas gordas o feas necesita para recuperar XP positivo
  const calcularRecuperacion = () => {
    if (xpAcumulada >= 0) return null;

    const gordasNecesarias = Math.ceil(Math.abs(xpAcumulada) / 40);
    const feasNecesarias = Math.ceil(Math.abs(xpAcumulada) / 20);

    return { gordasNecesarias, feasNecesarias };
  };

  const recuperacion = calcularRecuperacion();

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calculiadora de Farmeo</h1>
        {/* <ModeToggle /> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calculiadora de tu XP de farmeo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Selecciona la categoría:</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger id="categoria">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="penalizacion">Penalización:</Label>
                <Select value={penalizacion} onValueChange={setPenalizacion}>
                  <SelectTrigger id="penalizacion">
                    <SelectValue placeholder="Selecciona una penalización" />
                  </SelectTrigger>
                  <SelectContent>
                    {penalizaciones.map((pen) => (
                      <SelectItem key={pen.value} value={pen.value}>
                        {pen.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button variant="destructive" onClick={calcularXP}>
                Calcular XP
              </Button>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">
                {penalizacion === "ban" ? (
                  "¡Baneado del servidor!"
                ) : (
                  <>XP Total: {xpAcumulada}</>
                )}
              </h2>

              {recuperacion && (
                <div className="p-4 rounded-md bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground">
                  <p>
                    Necesitas farmear {recuperacion.gordasNecesarias} Gorda(s) o{" "}
                    {recuperacion.feasNecesarias} Fea(s) para recuperar XP
                    positivo.
                  </p>
                </div>
              )}
            </div>

            <Tabs defaultValue="historial">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="historial">Historial</TabsTrigger>
                <TabsTrigger value="conteo">Conteo</TabsTrigger>
              </TabsList>

              <TabsContent value="historial" className="mt-4">
                <div className="max-h-60 overflow-y-auto border rounded-md p-4">
                  {historial.length > 0 ? (
                    <ul className="space-y-2">
                      {historial.map((item, index) => (
                        <li key={index} className="border-b pb-2 last:border-0">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">
                      No hay historial disponible.
                    </p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="conteo" className="mt-4">
                <div className="border rounded-md p-4">
                  <ul className="space-y-2">
                    {Object.entries(conteo).map(([cat, count]) => {
                      const categoria = categorias.find((c) => c.value === cat);
                      return (
                        <li
                          key={cat}
                          className="flex justify-between border-b pb-2 last:border-0"
                        >
                          <span>{categoria?.text.split(" ")[0] || cat}</span>
                          <span className="font-semibold">Total: {count}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-4 pt-2 border-t">
                    <p className="flex justify-between">
                      <span className="font-semibold">
                        Promedio de multiplicador:
                      </span>
                      <span>{calcularPromedio()}</span>
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <WarzoneCalculator />
      </div>
    </div>
  );
};

export default FarmingCalculator;
