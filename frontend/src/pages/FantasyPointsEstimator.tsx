import React, { useState, useRef, useEffect, useMemo, KeyboardEvent } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from "../components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { toast } from "../components/ui/use-toast";

// --- PlayerSelector Component ---
type PlayerSelectorProps = {
  idx: number;
  value: string;
  allPlayers: string[];
  selectedNames: string[];
  onChange: (name: string) => void;
  onBlur: () => void;
  label: string;
};

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  if (lowerText.startsWith(lowerQuery)) {
    return (
      <>
        <span className="bg-yellow-200 dark:bg-yellow-700 rounded px-0.5">{text.slice(0, query.length)}</span>
        {text.slice(query.length)}
      </>
    );
  }
  return text;
}

const PlayerSelector = function PlayerSelector({
  idx,
  value,
  allPlayers,
  selectedNames,
  onChange,
  onBlur,
  label,
}: PlayerSelectorProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const filteredPlayers = useMemo(() => {
    const q = value.trim().toLowerCase();
    return allPlayers.filter(
      (name) => !selectedNames.includes(name) && name.toLowerCase().includes(q)
    );
  }, [allPlayers, selectedNames, value]);
  // Keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setHighlightedIdx((i) => Math.min(i + 1, filteredPlayers.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIdx((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && filteredPlayers[highlightedIdx]) {
      onChange(filteredPlayers[highlightedIdx]);
      setOpen(false);
      setHighlightedIdx(0);
      inputRef.current?.blur();
      e.preventDefault();
    }
  };
  return (
    <div className="relative">
      <Command shouldFilter={false}>
        <CommandInput
          ref={inputRef}
          placeholder={label}
          value={value}
          onValueChange={(val) => {
            onChange(val);
            setOpen(true);
            setHighlightedIdx(0);
          }}
          onInput={e => {
            onChange(e.currentTarget.value);
            setOpen(true);
            setHighlightedIdx(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            setOpen(false);
            onBlur();
          }}
          onKeyDown={handleKeyDown}
          aria-label={label}
        />
        <CommandList className={open && filteredPlayers.length > 0 ? "block" : "hidden"}>
          {value.trim().length === 0 ? null : (
            <>
              <CommandEmpty>No players found</CommandEmpty>
              {filteredPlayers.map((playerName, i) => (
                <CommandItem
                  key={playerName}
                  value={playerName}
                  onSelect={(selectedValue) => {
                    onChange(selectedValue);
                    setOpen(false);
                    setHighlightedIdx(0);
                  }}
                  className={
                    i === highlightedIdx
                      ? "bg-accent text-accent-foreground"
                      : ""
                  }
                >
                  {highlightMatch(playerName, value)}
                </CommandItem>
              ))}
            </>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

// --- Main FantasyPointsEstimator Page ---
type PlayerSelection = {
  name: string;
  captain: boolean;
  viceCaptain: boolean;
};

type PlayerPrediction = {
  name: string;
  points: number;
  tag?: string;
};

type FantasyPredictionResult = {
  total_points: number;
  captain_bonus: number;
  vice_captain_bonus: number;
  rank_low: number;
  rank_high: number;
  individual_preds: PlayerPrediction[];
};

export default function FantasyPointsEstimator() {
  const [players, setPlayers] = useState<PlayerSelection[]>([]);
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<FantasyPredictionResult | null>(null);
  const [allPlayers, setAllPlayers] = useState<string[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState<string | null>(null);
  const [highlightedIdx, setHighlightedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setLoadingPlayers(true);
    setFetchError(null);
    fetch("/api/fantasy/players")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch player names");
        return res.json();
      })
      .then((data) => {
        setAllPlayers(data);
        setLoadingPlayers(false);
      })
      .catch((err) => {
        setFetchError("Could not load player names");
        setLoadingPlayers(false);
      });
  }, []);

  // Filtered player suggestions
  const filteredPlayers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allPlayers.filter(
      (name) =>
        !players.some((p) => p.name === name) &&
        name.toLowerCase().includes(q)
    );
  }, [allPlayers, players, search]);

  // Add player
  const handleAddPlayer = (name: string) => {
    if (players.length >= 11) return;
    setPlayers((prev) => [...prev, { name, captain: false, viceCaptain: false }]);
    setSearch("");
    setHighlightedIdx(0);
    inputRef.current?.focus();
  };

  // Remove player
  const handleRemovePlayer = (idx: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  };

  // Captain/VC toggles
  const handleCaptainChange = (idx: number) => {
    setPlayers((prev) =>
      prev.map((p, i) => ({
        ...p,
        captain: i === idx ? !p.captain : false,
        viceCaptain: i === idx ? false : p.viceCaptain,
      }))
    );
  };
  const handleViceCaptainChange = (idx: number) => {
    setPlayers((prev) =>
      prev.map((p, i) => ({
        ...p,
        viceCaptain: i === idx ? !p.viceCaptain : false,
        captain: i === idx ? false : p.captain,
      }))
    );
  };

  // Keyboard navigation for search
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filteredPlayers.length === 0) return;
    if (e.key === "ArrowDown") {
      setHighlightedIdx((i) => Math.min(i + 1, filteredPlayers.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setHighlightedIdx((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter" && filteredPlayers[highlightedIdx]) {
      handleAddPlayer(filteredPlayers[highlightedIdx]);
      e.preventDefault();
    }
  };

  // Estimate points when 11 unique players and C/VC are set
  useEffect(() => {
    if (players.length === 11) {
      const capCount = players.filter((p) => p.captain).length;
      const vcapCount = players.filter((p) => p.viceCaptain).length;
      if (capCount === 1 && vcapCount === 1) {
        setEstimateError(null);
        setLoadingEstimate(true);
        fetch("/api/fantasy/estimate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            players: players.map(p => ({
              name: p.name,
              captain: p.captain,
              vice_captain: p.viceCaptain,
            })),
          }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to estimate points");
            return res.json();
          })
          .then((data) => {
            setResult(data);
            setLoadingEstimate(false);
          })
          .catch(() => {
            setEstimateError("Could not estimate fantasy points. Try again.");
            setLoadingEstimate(false);
          });
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  }, [players]);

  // Responsive, modern horizontal layout
  return (
    <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto py-8">
      {/* Player Selection Box */}
      <Card className="flex-1 p-6 flex flex-col min-w-[320px] max-w-lg">
        <h2 className="text-xl font-bold mb-4">Select Your Team</h2>
        {loadingPlayers ? (
          <div className="text-center py-8">Loading player names...</div>
        ) : fetchError ? (
          <div className="text-center text-red-500 py-8">{fetchError}</div>
        ) : (
          <>
            <div className="mb-4">
              <Command shouldFilter={false}>
                <CommandInput
                  ref={inputRef}
                  placeholder={players.length >= 11 ? "Max 11 players" : "Type player name..."}
                  value={search}
                  onValueChange={val => {
                    setSearch(val);
                    setHighlightedIdx(0);
                  }}
                  onInput={e => {
                    setSearch(e.currentTarget.value);
                    setHighlightedIdx(0);
                  }}
                  onKeyDown={handleKeyDown}
                  disabled={players.length >= 11}
                  aria-label="Search player"
                />
                <CommandList className={search && filteredPlayers.length > 0 ? "block" : "hidden"}>
                  {search.trim().length === 0 ? null : (
                    <>
                      <CommandEmpty>No players found</CommandEmpty>
                      {filteredPlayers.map((playerName, i) => (
                        <CommandItem
                          key={playerName}
                          value={playerName}
                          onSelect={() => handleAddPlayer(playerName)}
                          className={
                            i === highlightedIdx
                              ? "bg-accent text-accent-foreground"
                              : ""
                          }
                        >
                          {highlightMatch(playerName, search)}
                        </CommandItem>
                      ))}
                    </>
                  )}
                </CommandList>
              </Command>
            </div>
            <div className="space-y-2">
              {players.map((player, idx) => (
                <div key={player.name} className="flex items-center gap-2 bg-muted rounded px-2 py-1">
                  <span className="font-medium flex-1 truncate">{player.name}</span>
                  <Button
                    type="button"
                    variant={player.captain ? "default" : "outline"}
                    onClick={() => handleCaptainChange(idx)}
                    size="sm"
                    className={player.captain ? "bg-blue-600 text-white" : ""}
                    disabled={player.viceCaptain}
                  >
                    C
                  </Button>
                  <Button
                    type="button"
                    variant={player.viceCaptain ? "default" : "outline"}
                    onClick={() => handleViceCaptainChange(idx)}
                    size="sm"
                    className={player.viceCaptain ? "bg-green-600 text-white" : ""}
                    disabled={player.captain}
                  >
                    VC
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemovePlayer(idx)}
                    aria-label="Remove player"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {players.length}/11 selected. Pick one Captain (C) and one Vice-Captain (VC).
            </div>
          </>
        )}
      </Card>
      {/* Results/Insights Box */}
      <Card className="flex-1 p-6 flex flex-col min-w-[320px] max-w-xl">
        <h2 className="text-xl font-bold mb-4">Results & Insights</h2>
        {loadingEstimate && (
          <div className="text-center py-8">Estimating points...</div>
        )}
        {estimateError && (
          <div className="text-center text-red-500 py-8">{estimateError}</div>
        )}
        {result && (
          <>
            <div className="mb-4 p-4 rounded bg-gradient-to-r from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex flex-col items-center">
              <div className="text-3xl font-bold mb-2">{result.total_points} pts</div>
              <div className="flex gap-4 text-sm">
                <span>+{result.captain_bonus} <span className="font-semibold">C Bonus</span></span>
                <span>+{result.vice_captain_bonus} <span className="font-semibold">VC Bonus</span></span>
              </div>
              <div className="mt-2 text-lg font-semibold text-blue-700 dark:text-blue-200">
                Expected Rank: #{result.rank_low}–{result.rank_high}
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player</TableHead>
                  <TableHead>Points</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.individual_preds.map((p) => (
                  <TableRow key={p.name}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.points}</TableCell>
                    <TableCell>{p.tag}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              {result.total_points >= 300 && "Elite! Top 1% likely."}
              {result.total_points >= 250 && result.total_points < 300 && "Great! Top 5-10% likely."}
              {result.total_points >= 200 && result.total_points < 250 && "Good, but can improve!"}
              {result.total_points < 200 && "Try more all-rounders or different C/VC choices."}
            </div>
          </>
        )}
        {!loadingEstimate && !result && (
          <div className="text-center text-muted-foreground py-8">
            Select 11 players, assign C/VC, and see your fantasy insights here.
          </div>
        )}
      </Card>
    </div>
  );
}
