import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const WarzoneCalculator = () => {
  const [peso, setPeso] = useState("");
  const [sesiones, setSesiones] = useState<number | null>(null);
  const [sesionesIdeal, setSesionesIdeal] = useState<number | null>(null);

  const calcularSesiones = () => {
    if (!peso || isNaN(Number(peso)) || Number(peso) <= 0) return;
    const pesoNum = Number(peso);
    const caloriasPorKg = 7700; // Calorías necesarias para perder 1 kg de grasa
    const kilosAPerder = pesoNum * 0.1; // 10% del peso total
    const deficitTotal = kilosAPerder * caloriasPorKg;
    const caloriasPorSesion = 5000;
    const sesionesNecesarias = Math.ceil(deficitTotal / caloriasPorSesion);
    setSesiones(sesionesNecesarias);

    // Cálculo para el peso ideal
    const pesoIdeal = 22 * (1.7 * 1.7); // IMC de referencia con altura estimada 1.70m
    const kilosAPerderIdeal = pesoNum - pesoIdeal;
    const deficitTotalIdeal = kilosAPerderIdeal * caloriasPorKg;
    const sesionesParaPesoIdeal = Math.ceil(deficitTotalIdeal / caloriasPorSesion);
    setSesionesIdeal(sesionesParaPesoIdeal > 0 ? sesionesParaPesoIdeal : 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPeso(e.target.value);
    setSesiones(null); // Reiniciar el resultado al ingresar un nuevo valor
    setSesionesIdeal(null);
  };

  return (
    <Card className="max-w-md mx-auto p-6 text-center">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Calculadora de Cardio con gordas
            Logra saber cuantas culiadas necesita ella para bajar de peso.
        </h2>
        <input
          type="number"
          placeholder="Ingresa tu peso (kg)"
          value={peso}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded"
          inputMode="numeric"
        />
        <Button onClick={calcularSesiones} className="w-full">
          Calcular
        </Button>
        {sesiones !== null && (
          <p className="mt-4 text-lg font-semibold">
            Necesitas aproximadamente {sesiones} sesiones de picha para perder el 10% de tu peso.
          </p>
        )}
        {sesionesIdeal !== null && (
          <p className="mt-4 text-lg font-semibold">
            Para alcanzar tu peso ideal, necesitarías alrededor de {sesionesIdeal} sesiones de picha.
          </p>
        )}
      </CardContent>
    </Card>
  );
};