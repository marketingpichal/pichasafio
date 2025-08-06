import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Leaderboard {
  id: number;
  profileId: string;
  points: number;
  level: number;
  rank: string;
  last_activity: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  achievements: any;
  position: number;
}

const LeaderboardTable = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const { data: leaderboardData, error } = await supabase
          .from("leaderboard")
          .select("id, profileId, points, level, rank, last_activity") // Especificar columnas
          .order("points", { ascending: false })
          .limit(10);

        if (error) {
          console.error("Error fetching leaderboard:", error);
          return;
        }
        // Adaptar los datos recibidos para cumplir con la interfaz Leaderboard
        const leaderboardAdapted =
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (leaderboardData || []).map((item: any, idx: number) => ({
            ...item,
            achievements: item.achievements ?? [],
            position: idx + 1,
          })) as Leaderboard[];
        setLeaderboard(leaderboardAdapted);
      } catch (error) {
        console.error("Error al obtener la tabla de líderes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Modificar la suscripción para ser más específica
    const subscription = supabase
      .channel("public:leaderboard")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leaderboard",
        },
        fetchLeaderboard
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            Cargando tabla de líderes...
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
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
                entry.profileId === user?.id
                  ? "bg-primary/10"
                  : "bg-secondary/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">#{index + 1}</span>
                <div>
                  <p className="font-semibold">
                    Usuario {entry.profileId.slice(0, 8)}...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nivel {entry.level}
                  </p>
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
  );
};

export default LeaderboardTable;
