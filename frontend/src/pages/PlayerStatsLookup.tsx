import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, User, BarChart3, TrendingUp, Target, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useLocation } from "react-router-dom";

interface PlayerStat {
  batter: string;
  total_runs: number;
  total_mat: number;
  balls_faced: number;
  strike_rate: number;
  highest_run: number;
  half_centuries: number;
  centuries: number;
  recent_scores: number[];
  average_recent: number;
  total_recent: number;
  trend: string;
}

export default function PlayerStatsLookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [batters, setBatters] = useState<string[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerData, setPlayerData] = useState<PlayerStat | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/player-stats/batters`)
      .then(res => res.json())
      .then(data => setBatters(data.batters))
      .catch(() => setError("Failed to load batters list"));
  }, []);

  // Auto-select player from query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const playerParam = params.get("player");
    if (playerParam && batters.length > 0) {
      setSearchQuery(playerParam);
      handlePlayerSelect(playerParam);
    }
    // eslint-disable-next-line
  }, [location.search, batters]);

  const filteredPlayers = batters.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayerSelect = async (playerName: string) => {
    setIsLoading(true);
    setSelectedPlayer(playerName);
    setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/player-stats/${encodeURIComponent(playerName)}`);
      if (!res.ok) throw new Error("Player not found");
      const data = await res.json();
      setPlayerData(data);
    } catch (e) {
      setPlayerData(null);
      setError("Failed to fetch player stats");
    }
    setIsLoading(false);
  };

  const recentFormData = playerData?.recent_scores.map((score, index) => ({
    match: `M${index + 1}`,
    score
  })) || [];

  const trendIcon = (trend: string) => {
    if (trend === "improving") return <TrendingUp className="inline h-5 w-5 text-green-600" />;
    if (trend === "declining") return <TrendingDown className="inline h-5 w-5 text-red-600" />;
    if (trend === "stable") return <Minus className="inline h-5 w-5 text-gray-400" />;
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Player Stats Lookup</h1>
        <p className="text-lg text-gray-600">
          Search and analyze comprehensive player statistics
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Search Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Batters
            </CardTitle>
            <CardDescription>
              Find and select a batter to view detailed statistics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search batter name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map(name => (
                  <Button
                    key={name}
                    variant={selectedPlayer === name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handlePlayerSelect(name)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <div className="text-left">
                      <div className="font-medium">{name}</div>
                    </div>
                  </Button>
                ))
              ) : searchQuery ? (
                <p className="text-center text-gray-500 py-4">No batters found</p>
              ) : (
                <p className="text-center text-gray-500 py-4">Start typing to search batters</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stats Display */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2">Loading player stats...</span>
              </CardContent>
            </Card>
          ) : error ? (
            <Card>
              <CardContent className="text-center py-12 text-red-600">{error}</CardContent>
            </Card>
          ) : selectedPlayer && playerData ? (
            <>
              {/* Player Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {playerData.batter}
                  </CardTitle>
                  <CardDescription>
                    Career statistics and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{playerData.total_mat}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{playerData.total_runs}</div>
                      <div className="text-sm text-gray-600">Runs</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{playerData.strike_rate}</div>
                      <div className="text-sm text-gray-600">Strike Rate</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{playerData.balls_faced}</div>
                      <div className="text-sm text-gray-600">Balls Faced</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Milestones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Centuries</span>
                      <Badge variant="secondary">{playerData.centuries}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Half Centuries</span>
                      <Badge variant="secondary">{playerData.half_centuries}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Highest Score</span>
                      <Badge variant="secondary">{playerData.highest_run}</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Recent Form
                    </CardTitle>
                    <CardDescription>
                      Last 10 innings performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={recentFormData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="match" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="score"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-4">
                      <span>Recent Avg: <b>{playerData.average_recent.toFixed(1)}</b></span>
                      <span>Total: <b>{playerData.total_recent}</b></span>
                      <span>Trend: <b>{trendIcon(playerData.trend)} {playerData.trend.charAt(0).toUpperCase() + playerData.trend.slice(1)}</b></span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select a batter to view detailed statistics</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
