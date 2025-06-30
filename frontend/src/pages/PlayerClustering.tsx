import { useState, useEffect, useMemo, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from "@/components/ui/select";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty
} from "@/components/ui/command";
import { useNavigate } from "react-router-dom";

const API_BASE = "/api/clustering";

type BatterCluster = {
  cluster_label: string;
  members: string[];
  avg_strike_rate: number;
  avg_4s: number;
  avg_6s: number;
  count: number;
};

type BowlerCluster = {
  cluster_label: string;
  members: string[];
  avg_economy: number;
  avg_wickets: number;
  count: number;
};

const PlayerClustering = () => {
  const [mode, setMode] = useState<'batters' | 'bowlers'>('batters');
  const [clusters, setClusters] = useState<BatterCluster[] | BowlerCluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [justSelected, setJustSelected] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const allPlayers = useMemo(() =>
    Array.from(new Set(clusters.flatMap(cluster => cluster.members))).sort(),
    [clusters]
  );
  const filteredPlayers = useMemo(() =>
    allPlayers.filter(player => player.toLowerCase().includes(search.toLowerCase())),
    [allPlayers, search]
  );

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSelectedCluster(null);
    setPlayerInfo(null);
    fetch(`${API_BASE}/${mode}`)
      .then(res => res.json())
      .then(data => {
        setClusters(data.clusters);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load clusters");
        setLoading(false);
      });
  }, [mode]);

  const handlePlayerSearch = () => {
    if (!search.trim()) return;
    setPlayerLoading(true);
    setPlayerError(null);
    setPlayerInfo(null);
    fetch(`${API_BASE}/${mode}/${encodeURIComponent(search.trim())}`)
      .then(res => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(data => {
        setPlayerInfo(data);
        setPlayerLoading(false);
      })
      .catch(() => {
        setPlayerError("Player not found in clusters");
        setPlayerLoading(false);
      });
  };

  function handlePlayerClick(player: string) {
    if (playerLoading) return;
    setSearch(player);
    setPlayerLoading(true);
    setPlayerError(null);
    setPlayerInfo(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetch(`${API_BASE}/${mode}/${encodeURIComponent(player)}`)
        .then(res => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then(data => {
          setPlayerInfo(data);
          setPlayerLoading(false);
        })
        .catch(() => {
          setPlayerError("Player not found in clusters");
          setPlayerLoading(false);
        });
    }, 200);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          Player Clustering Analysis
        </h1>
        <p className="text-gray-600 mt-2">
          ML-powered player categorization based on performance patterns
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <Button variant={mode === 'batters' ? 'default' : 'outline'} onClick={() => setMode('batters')}>Batters</Button>
          <Button variant={mode === 'bowlers' ? 'default' : 'outline'} onClick={() => setMode('bowlers')}>Bowlers</Button>
        </div>
      </div>

      {/* Player search bar with autocomplete suggestions */}
      <div className="flex flex-col items-center my-4">
        <div className="w-64">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Type player name..."
              value={search}
              onValueChange={val => {
                setSearch(val);
                setJustSelected(false);
              }}
              onInput={e => {
                setSearch(e.currentTarget.value);
                setJustSelected(false);
              }}
              aria-label="Search player"
            />
            <CommandList>
              {search.trim().length === 0 || justSelected ? null : loading ? (
                <div className="flex justify-center items-center h-24">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-blue-600">Loading players...</span>
                </div>
              ) : (
                <>
                  <CommandEmpty>No players found</CommandEmpty>
                  {filteredPlayers.map(player => (
                    <CommandItem
                      key={player}
                      value={player}
                      onSelect={() => {
                        setSearch(player);
                        setJustSelected(true);
                        handlePlayerClick(player);
                      }}
                    >
                      {player}
                    </CommandItem>
                  ))}
                </>
              )}
            </CommandList>
          </Command>
        </div>
      </div>

      {playerError && <div className="text-red-500 text-center">{playerError}</div>}
      {playerInfo && (
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>{playerInfo.player}</CardTitle>
            <CardDescription>Cluster: <b>{playerInfo.cluster_label}</b></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1 text-sm">
              {mode === 'batters' ? (
                <>
                  <div>Strike Rate: <b>{playerInfo.strike_rate}</b></div>
                  <div>4s: <b>{playerInfo['4s']}</b> | 6s: <b>{playerInfo['6s']}</b></div>
                </>
              ) : (
                <>
                  <div>Economy: <b>{playerInfo.economy}</b></div>
                  <div>Wickets: <b>{playerInfo.wickets}</b></div>
                </>
              )}
            </div>
            <Button
              className="mt-4"
              onClick={() => navigate(`/player-stats-lookup?player=${encodeURIComponent(playerInfo.player)}`)}
            >
              Show Player Stats
            </Button>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center">Loading clusters...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clusters.map((cluster: any, idx) => (
            <Card
              key={cluster.cluster_label}
              className={`cursor-pointer transition-all hover:shadow-lg ${selectedCluster === cluster.cluster_label ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => setSelectedCluster(selectedCluster === cluster.cluster_label ? null : cluster.cluster_label)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{cluster.cluster_label}</CardTitle>
                <CardDescription className="text-sm">
                  {mode === 'batters' ? (
                    <>
                      Avg Strike Rate: <b>{cluster.avg_strike_rate}</b><br />
                      Avg 4s: <b>{cluster.avg_4s}</b> | Avg 6s: <b>{cluster.avg_6s}</b>
                    </>
                  ) : (
                    <>
                      Avg Economy: <b>{cluster.avg_economy}</b><br />
                      Avg Wickets: <b>{cluster.avg_wickets}</b>
                    </>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>{cluster.count} players</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedCluster && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{selectedCluster} Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {clusters.find((c: any) => c.cluster_label === selectedCluster)?.members.map((player: string, idx: number) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-100 transition"
                  onClick={() => navigate(`/player-stats-lookup?player=${encodeURIComponent(player)}`)}
                >
                  {player}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlayerClustering;
