import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { iplTeams, iplVenues } from "@/data/mockData";
import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";

interface MatchState {
  batting_team: string;
  bowling_team: string;
  venue: string;
  over: string;
  ball: string;
  current_score: string;
  wickets: string;
  runs_last_5: string;
  target: string;
}

interface Prediction {
  predicted_score: number;
  win_probability_team1: number;
  win_probability_team2: number;
  certainty: string;
  input_used?: {
    target?: number;
    current_score?: number;
  };
}

export default function LiveMatchPredictor() {
  const [matchState, setMatchState] = useState<MatchState>({
    batting_team: '',
    bowling_team: '',
    venue: '',
    over: '',
    ball: '',
    current_score: '',
    wickets: '',
    runs_last_5: '',
    target: '',
  });
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: keyof MatchState, value: string) => {
    setMatchState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculations for display
  const ball_no = parseInt(matchState.over) * 6 + parseInt(matchState.ball);
  const balls_remaining = 120 - ball_no;
  const current_score = parseInt(matchState.current_score);
  const target = parseInt(matchState.target);
  const runs_required = target - current_score;
  const run_rate = ball_no > 0 ? current_score / (ball_no / 6) : 0;
  const required_run_rate = balls_remaining > 0 ? runs_required / (balls_remaining / 6) : 0;

  const generatePrediction = async () => {
    setError(null);
    if (!matchState.batting_team || !matchState.bowling_team || !matchState.venue || !matchState.over || !matchState.ball || !matchState.current_score || !matchState.wickets || !matchState.runs_last_5 || !matchState.target) {
      setError('Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      const reqBody = {
        batting_team: matchState.batting_team,
        bowling_team: matchState.bowling_team,
        venue: matchState.venue,
        over: parseInt(matchState.over),
        ball: parseInt(matchState.ball),
        current_score: current_score,
        wickets: parseInt(matchState.wickets),
        runs_last_5: parseInt(matchState.runs_last_5),
        target: target
      };
      const response = await fetch('http://localhost:8000/api/live-match/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqBody),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Prediction failed');
      }
      const data = await response.json();
      setPrediction(data);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message || 'Prediction failed');
      } else {
        setError('Prediction failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Live Match Predictor (2nd Innings)</h1>
        <p className="text-lg text-gray-600">
          Get real-time predictions for ongoing IPL chases (second innings)
        </p>
      </div>
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Match State
            </CardTitle>
            <CardDescription>
              Enter the current match state to predict the chase outcome
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batting_team">Batting Team</Label>
                <Select value={matchState.batting_team} onValueChange={(value) => handleInputChange('batting_team', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {iplTeams.map(team => (
                      <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bowling_team">Bowling Team</Label>
                <Select value={matchState.bowling_team} onValueChange={(value) => handleInputChange('bowling_team', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select team" />
                  </SelectTrigger>
                  <SelectContent>
                    {iplTeams.filter(team => team.name !== matchState.batting_team).map(team => (
                      <SelectItem key={team.id} value={team.name}>{team.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="venue">Venue</Label>
              <Select value={matchState.venue} onValueChange={(value) => handleInputChange('venue', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {iplVenues.map(venue => (
                    <SelectItem key={venue} value={venue}>{venue}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="over">Over</Label>
                <Input
                  id="over"
                  type="number"
                  placeholder="0"
                  value={matchState.over}
                  onChange={(e) => handleInputChange('over', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ball">Ball</Label>
                <Input
                  id="ball"
                  type="number"
                  placeholder="0"
                  value={matchState.ball}
                  onChange={(e) => handleInputChange('ball', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="current_score">Current Score</Label>
                <Input
                  id="current_score"
                  type="number"
                  placeholder="0"
                  value={matchState.current_score}
                  onChange={(e) => handleInputChange('current_score', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wickets">Wickets</Label>
                <Input
                  id="wickets"
                  type="number"
                  placeholder="0"
                  value={matchState.wickets}
                  onChange={(e) => handleInputChange('wickets', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="runs_last_5">Runs in Last 5 Overs</Label>
                <Input
                  id="runs_last_5"
                  type="number"
                  placeholder="0"
                  value={matchState.runs_last_5}
                  onChange={(e) => handleInputChange('runs_last_5', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="target">Target</Label>
                <Input
                  id="target"
                  type="number"
                  placeholder="0"
                  value={matchState.target}
                  onChange={(e) => handleInputChange('target', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>Balls Remaining: <b>{isNaN(balls_remaining) ? '-' : balls_remaining}</b></div>
              <div>Runs Required: <b>{isNaN(runs_required) ? '-' : runs_required}</b></div>
              <div>Current Run Rate: <b>{isNaN(run_rate) ? '-' : run_rate.toFixed(2)}</b></div>
              <div>Required Run Rate: <b>{isNaN(required_run_rate) ? '-' : required_run_rate.toFixed(2)}</b></div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button 
              onClick={generatePrediction} 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Predict Score
                </>
              )}
            </Button>
          </CardContent>
        </Card>
        {/* Prediction Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Predicted Score
            </CardTitle>
            <CardDescription>
              AI-powered innings score prediction
            </CardDescription>
          </CardHeader>
          <CardContent>
            {prediction ? (
              <div className="space-y-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {prediction.predicted_score}
                  </div>
                  <div className="text-sm text-gray-600">Predicted Final Score</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Win Probabilities</span>
                  <div>
                    <Badge variant="secondary" className="mx-1">
                      Team 1: {(prediction.win_probability_team1 * 100).toFixed(2)}%
                    </Badge>
                    <Badge variant="secondary" className="mx-1">
                      Team 2: {(prediction.win_probability_team2 * 100).toFixed(2)}%
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-medium text-gray-900 px-2 py-1 rounded ${
                    prediction.certainty === 'high' ? 'bg-green-200 text-green-800' :
                    prediction.certainty === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-red-200 text-red-800'
                  }`}>
                    Confidence: {prediction.certainty.charAt(0).toUpperCase() + prediction.certainty.slice(1)}
                  </span>
                </div>
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Score Insight</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Based on the current match state, the model predicts a final score of <b>{prediction.predicted_score}</b> runs.<br />
                    Team 1 win probability: <b>{(prediction.win_probability_team1 * 100).toFixed(2)}%</b><br />
                    Team 2 win probability: <b>{(prediction.win_probability_team2 * 100).toFixed(2)}%</b><br />
                    Confidence: <b>{prediction.certainty.charAt(0).toUpperCase() + prediction.certainty.slice(1)}</b><br />
                    {prediction.input_used && prediction.input_used.target !== undefined && (
                      <>
                        Chasing Target: <b>{prediction.input_used.target}</b><br />
                        Runs Required: <b>{prediction.input_used.target - prediction.input_used.current_score}</b><br />
                      </>
                    )}
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-gray-500">Show model input details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">{JSON.stringify(prediction.input_used, null, 2)}</pre>
                  </details>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Enter match details to see score prediction</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
