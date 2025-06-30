import { useState, useRef, useMemo, KeyboardEvent, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { iplTeams, mockPlayers } from "@/data/mockData";
import { Users, Target, TrendingUp, Star, Plus, X } from "lucide-react";

interface SelectedPlayer {
  id: number;
  name: string;
  role: string;
  team: string;
  predictedRuns?: number;
  predictedWickets?: number;
}

interface TeamPrediction {
  totalRuns: number;
  totalWickets: number;
  bestPerformer: string;
}

type Prediction = {
  name: string;
  team: string;
  role: string;
  predicted_runs: number;
  predicted_wickets: number;
};

// PlayerSelector component for autocomplete
interface PlayerSelectorProps {
  value: string;
  allPlayers: { id: string; name: string }[];
  selectedIds: string[];
  onChange: (name: string) => void;
  onSelect: (player: { id: string; name: string }) => void;
  label: string;
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (lowerText.startsWith(lowerQuery)) {
    return (
      <>
        <span className="bg-yellow-200 rounded px-0.5">{text.slice(0, query.length)}</span>
        {text.slice(query.length)}
      </>
    );
  }
  return text;
}

const PlayerSelector = ({ value, allPlayers, selectedIds, onChange, onSelect, label }: PlayerSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const filteredPlayers = useMemo(() => {
    const q = value.trim().toLowerCase();
    return allPlayers.filter(
      (p) => !selectedIds.includes(p.name) && p.name.toLowerCase().includes(q)
    );
  }, [allPlayers, selectedIds, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlightedIdx((i) => Math.min(i + 1, filteredPlayers.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIdx((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && filteredPlayers[highlightedIdx]) {
      onSelect(filteredPlayers[highlightedIdx]);
      setOpen(false);
      setHighlightedIdx(0);
      onChange("");
      e.preventDefault();
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
        placeholder={label}
        value={value}
        onChange={e => {
          onChange(e.target.value);
          setOpen(true);
          setHighlightedIdx(0);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleKeyDown}
        aria-label={label}
      />
      {open && filteredPlayers.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto mt-1">
          {filteredPlayers.map((player, i) => (
            <li
              key={player.id}
              className={`px-3 py-2 cursor-pointer flex items-center justify-between ${i === highlightedIdx ? "bg-blue-100" : ""}`}
              onMouseDown={() => {
                onSelect(player);
                setOpen(false);
                setHighlightedIdx(0);
                onChange("");
              }}
            >
              <span>{highlightMatch(player.name, value)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function PlayerPerformancePredictor() {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedPlayers, setSelectedPlayers] = useState<SelectedPlayer[]>([]);
  const [teamPrediction, setTeamPrediction] = useState<TeamPrediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [playerSearch, setPlayerSearch] = useState("");
  const [allPlayers, setAllPlayers] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/player-performance/all_players")
      .then(res => res.json())
      .then(data => setAllPlayers(data.players));
  }, []);

  const handlePlayerSelect = async (playerName: string) => {
    if (selectedPlayers.length < 11 && !selectedPlayers.find(p => p.name === playerName)) {
      // Fetch role and team from backend
      const res = await fetch(`/api/player-performance/player_info/${encodeURIComponent(playerName)}`);
      const info = await res.json();
      setSelectedPlayers([...selectedPlayers, {
        id: playerName,
        name: playerName,
        role: info.role || '',
        team: info.team || '',
      }]);
    }
    setPlayerSearch("");
  };

  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
  };

  const generateTeamPrediction = async () => {
    if (selectedPlayers.length === 0) return;
    setIsLoading(true);

    // Prepare payload (remove id, keep name, team, role)
    const payload = selectedPlayers.map(({ name, team, role }) => ({ name, team, role }));

    const response = await fetch("/api/player-performance/predict_player_performance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const predictions: Prediction[] = data.predictions;

    // Update selectedPlayers with predictions
    setSelectedPlayers(selectedPlayers.map(player => {
      const pred = predictions.find((p) => p.name === player.name);
      return {
        ...player,
        predictedRuns: pred?.predicted_runs ?? 0,
        predictedWickets: pred?.predicted_wickets ?? 0,
      };
    }));

    setTeamPrediction({
      totalRuns: data.team_summary.total_runs,
      totalWickets: data.team_summary.total_wickets,
      bestPerformer: data.team_summary.best_performer,
    });

    setIsLoading(false);
  };

  const getRoleColor = (role: string) => {
    if (role.includes('Batsman')) return 'bg-blue-100 text-blue-800';
    if (role.includes('Bowler')) return 'bg-red-100 text-red-800';
    if (role.includes('All-rounder')) return 'bg-green-100 text-green-800';
    if (role.includes('Wicket-keeper')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Player Performance Predictor</h1>
        <p className="text-lg text-gray-600">
          Build your team and predict individual player performances
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Team Builder */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Builder
            </CardTitle>
            <CardDescription>
              Select up to 11 players for performance prediction
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Add Player</label>
              <PlayerSelector
                value={playerSearch}
                allPlayers={allPlayers.map(name => ({ id: name, name }))}
                selectedIds={selectedPlayers.map(p => p.name)}
                onChange={setPlayerSearch}
                onSelect={player => handlePlayerSelect(player.name)}
                label="Type player name"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Selected Players</span>
                <Badge variant="secondary">{selectedPlayers.length}/11</Badge>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedPlayers.map(player => (
                  <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{player.name}</div>
                      <div className="text-xs text-gray-500">{player.team}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getRoleColor(player.role)}`}>
                        {player.role}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removePlayer(player.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                {selectedPlayers.length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No players selected</p>
                )}
              </div>
            </div>

            <Button 
              onClick={generateTeamPrediction} 
              className="w-full" 
              disabled={selectedPlayers.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Predict Performance
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Predictions Display */}
        <div className="lg:col-span-2 space-y-6">
          {teamPrediction && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Team Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{teamPrediction.totalRuns}</div>
                    <div className="text-sm text-gray-600">Predicted Runs</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{teamPrediction.totalWickets}</div>
                    <div className="text-sm text-gray-600">Predicted Wickets</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Star className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
                    <div className="text-xs text-gray-600 truncate">{teamPrediction.bestPerformer}</div>
                    <div className="text-xs text-gray-500">Top Performer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Player Predictions */}
          {selectedPlayers.length > 0 && selectedPlayers[0].predictedRuns !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Individual Player Predictions
                </CardTitle>
                <CardDescription>
                  Detailed performance forecast for each selected player
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedPlayers.map(player => (
                    <div key={player.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-sm text-gray-500">{player.team} • {player.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-bold text-blue-600">{player.predictedRuns}</div>
                          <div className="text-xs text-gray-500">Runs</div>
                        </div>
                        {player.predictedWickets! > 0 && (
                          <div className="text-center">
                            <div className="font-bold text-red-600">{player.predictedWickets}</div>
                            <div className="text-xs text-gray-500">Wickets</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {selectedPlayers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Select players to view performance predictions</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}