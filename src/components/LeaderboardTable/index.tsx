import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { challengeService, type LeaderboardEntry } from "@/lib/challengeService";

const LeaderboardTable = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const leaderboardData = await challengeService.getLeaderboard(10);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("Error al obtener la tabla de líderes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();

    // Suscripción para actualizaciones en tiempo real
    const subscription = supabase
      .channel("public:leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
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
                entry.user_id === user?.id
                  ? "bg-primary/10"
                  : "bg-secondary/10"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold">#{index + 1}</span>
                <div>
                  <p className="font-semibold">
                    {entry.username || `Usuario ${entry.user_id.slice(0, 8)}...`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Nivel {entry.level} • {entry.rank}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{entry.total_points} XP</p>
                <p className="text-sm text-muted-foreground">
                  Racha: {entry.current_streak} días
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
