import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LeaderboardTable from "@/components/LeaderboardTable";

interface Leaderboard {
  id: number;
  profileId: string;
  points: number;
  level: number;
  rank: string;
  last_activity: string;
  achievements: any;
  position: number;
}

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

  const supabase = useSupabaseClient();
  const user = useUser();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [dailyCount, setDailyCount] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState("gorda");
  const [penalizacion, setPenalizacion] = useState("none");
  const [xpAcumulada, setXpAcumulada] = useState(0);
  const [historial, setHistorial] = useState<string[]>([]);

  // Modificar calcularXP para eliminar la actualización del leaderboard
  const calcularXP = async () => {
    if (!user?.id || !canSubmit) return;

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

    try {
      const { data: existingUser, error: userError } = await supabase
        .from('leaderboard')
        .select('points, level')
        .eq('profileId', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw userError;
      }

      const currentPoints = existingUser?.points || 0;
      const newPoints = currentPoints + xpGanada;
      const newLevel = Math.floor(newPoints / 1000) + 1;

      if (existingUser) {
        await supabase
          .from('leaderboard')
          .update({
            points: newPoints,
            level: newLevel,
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('profileId', user.id);
      } else {
        await supabase
          .from('leaderboard')
          .insert({
            profileId: user.id,
            points: xpGanada,
            level: 1,
            rank: 'Novato',
            last_activity: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
      }

      setXpAcumulada(newPoints);
      setDailyCount(prev => prev + 1);
      setCanSubmit(prev => (prev + 1) < 2);
      setHistorial((prev) => [
        `${categoriaSeleccionada.text} con ${penalizacionSeleccionada.text}: ${xpGanada} XP - Total: ${newPoints} XP - ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
    } catch (error) {
      console.error('Error saving to Supabase:', error);
    }
  };

  // Modificar el return para incluir el nuevo componente LeaderboardTable
  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Calculadora de Farmeo</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Categoría</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue />
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

            <div className="grid gap-2">
              <Label>Penalización</Label>
              <Select value={penalizacion} onValueChange={setPenalizacion}>
                <SelectTrigger>
                  <SelectValue />
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

            <Button onClick={calcularXP} disabled={!canSubmit}>
              Calcular XP
            </Button>

            <div className="text-center">
              <p className="text-2xl font-bold">XP Acumulada: {xpAcumulada}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {!canSubmit && (
        <div className="mt-4 p-4 bg-yellow-100 text-yellow-800 rounded-md">
          Has alcanzado el límite de 2 registros diarios. Vuelve mañana!
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Tabla de Líderes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.profileId === user.id ? 'bg-primary/10' : 'bg-secondary/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold">#{index + 1}</span>
                  <div>
                    <p className="font-semibold">Usuario {entry.profileId.slice(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">Nivel {entry.level}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{entry.points} XP</p>
                  <p className="text-sm text-muted-foreground">{entry.rank}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {historial.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historial.map((entrada, index) => (
                <div key={index} className="text-sm text-gray-500">
                  {entrada}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <LeaderboardTable />

      {historial.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historial</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {historial.map((entrada, index) => (
                <div key={index} className="text-sm text-gray-500">
                  {entrada}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FarmingCalculator;