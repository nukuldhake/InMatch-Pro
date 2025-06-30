export const iplTeams = [
  { id: 'CSK', name: 'Chennai Super Kings', color: '#FDB315' },
  { id: 'MI', name: 'Mumbai Indians', color: '#004BA0' },
  { id: 'RCB', name: 'Royal Challengers Bangalore', color: '#EC1C24' },
  { id: 'KKR', name: 'Kolkata Knight Riders', color: '#3A225D' },
  { id: 'SRH', name: 'Sunrisers Hyderabad', color: '#FF822A' },
  { id: 'DC', name: 'Delhi Capitals', color: '#282968' },
  { id: 'PBKS', name: 'Punjab Kings', color: '#ED1B24' },
  { id: 'RR', name: 'Rajasthan Royals', color: '#E41F69' },
  { id: 'GT', name: 'Gujarat Titans', color: '#1B2951' },
  { id: 'LSG', name: 'Lucknow Super Giants', color: '#00A0E6' },
];

export const iplVenues = [
  "Arun Jaitley Stadium",
  "Arun Jaitley Stadium, Delhi",
  "Barabati Stadium",
  "Barsapara Cricket Stadium, Guwahati",
  "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow",
  "Brabourne Stadium",
  "Brabourne Stadium, Mumbai",
  "Buffalo Park",
  "De Beers Diamond Oval",
  "Dr DY Patil Sports Academy",
  "Dr DY Patil Sports Academy, Mumbai",
  "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
  "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
  "Dubai International Cricket Stadium",
  "Eden Gardens",
  "Eden Gardens, Kolkata",
  "Feroz Shah Kotla",
  "Green Park",
  "Himachal Pradesh Cricket Association Stadium",
  "Himachal Pradesh Cricket Association Stadium, Dharamsala",
  "Holkar Cricket Stadium",
  "JSCA International Stadium Complex",
  "Kingsmead",
  "M Chinnaswamy Stadium",
  "M Chinnaswamy Stadium, Bengaluru",
  "M.Chinnaswamy Stadium",
  "MA Chidambaram Stadium",
  "MA Chidambaram Stadium, Chepauk",
  "MA Chidambaram Stadium, Chepauk, Chennai",
  "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur",
  "Maharashtra Cricket Association Stadium",
  "Maharashtra Cricket Association Stadium, Pune",
  "Narendra Modi Stadium, Ahmedabad",
  "Nehru Stadium",
  "New Wanderers Stadium",
  "Newlands",
  "OUTsurance Oval",
  "Punjab Cricket Association IS Bindra Stadium",
  "Punjab Cricket Association IS Bindra Stadium, Mohali",
  "Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh",
  "Punjab Cricket Association Stadium, Mohali",
  "Rajiv Gandhi International Stadium",
  "Rajiv Gandhi International Stadium, Uppal",
  "Rajiv Gandhi International Stadium, Uppal, Hyderabad",
  "Sardar Patel Stadium, Motera",
  "Saurashtra Cricket Association Stadium",
  "Sawai Mansingh Stadium",
  "Sawai Mansingh Stadium, Jaipur",
  "Shaheed Veer Narayan Singh International Stadium",
  "Sharjah Cricket Stadium",
  "Sheikh Zayed Stadium",
  "St George's Park",
  "Subrata Roy Sahara Stadium",
  "SuperSport Park",
  "Vidarbha Cricket Association Stadium, Jamtha",
  "Wankhede Stadium",
  "Wankhede Stadium, Mumbai",
  "Zayed Cricket Stadium, Abu Dhabi"
];

export const mockPlayers = [
  // CSK
  { id: 1, name: 'MS Dhoni', team: 'CSK', role: 'Wicket-keeper', type: 'batsman' },
  { id: 2, name: 'Ruturaj Gaikwad', team: 'CSK', role: 'Batsman', type: 'batsman' },
  { id: 3, name: 'Ravindra Jadeja', team: 'CSK', role: 'All-rounder', type: 'allrounder' },
  { id: 4, name: 'Deepak Chahar', team: 'CSK', role: 'Bowler', type: 'bowler' },
  
  // MI
  { id: 5, name: 'Rohit Sharma', team: 'MI', role: 'Batsman', type: 'batsman' },
  { id: 6, name: 'Ishan Kishan', team: 'MI', role: 'Wicket-keeper', type: 'batsman' },
  { id: 7, name: 'Hardik Pandya', team: 'MI', role: 'All-rounder', type: 'allrounder' },
  { id: 8, name: 'Jasprit Bumrah', team: 'MI', role: 'Bowler', type: 'bowler' },
  
  // RCB
  { id: 9, name: 'Virat Kohli', team: 'RCB', role: 'Batsman', type: 'batsman' },
  { id: 10, name: 'Faf du Plessis', team: 'RCB', role: 'Batsman', type: 'batsman' },
  { id: 11, name: 'Glenn Maxwell', team: 'RCB', role: 'All-rounder', type: 'allrounder' },
  { id: 12, name: 'Mohammed Siraj', team: 'RCB', role: 'Bowler', type: 'bowler' },
  
  // KKR
  { id: 13, name: 'Shreyas Iyer', team: 'KKR', role: 'Batsman', type: 'batsman' },
  { id: 14, name: 'Andre Russell', team: 'KKR', role: 'All-rounder', type: 'allrounder' },
  { id: 15, name: 'Sunil Narine', team: 'KKR', role: 'All-rounder', type: 'allrounder' },
  { id: 16, name: 'Pat Cummins', team: 'KKR', role: 'Bowler', type: 'bowler' },
  
  // Add more players for other teams...
  { id: 17, name: 'David Warner', team: 'SRH', role: 'Batsman', type: 'batsman' },
  { id: 18, name: 'Abhishek Sharma', team: 'SRH', role: 'All-rounder', type: 'allrounder' },
  { id: 19, name: 'Rashid Khan', team: 'SRH', role: 'Bowler', type: 'bowler' },
  { id: 20, name: 'Bhuvneshwar Kumar', team: 'SRH', role: 'Bowler', type: 'bowler' },
];

export const mockMatchData = {
  liveMatch: {
    team1: 'CSK',
    team2: 'MI',
    venue: 'M.A. Chidambaram Stadium, Chennai',
    overs: 15.3,
    score: 142,
    wickets: 4,
    predictedScore: 178,
    winProbability: 65,
  },
};

export const playerStats = {
  'Virat Kohli': {
    matches: 237,
    runs: 7263,
    average: 36.32,
    strikeRate: 130.41,
    centuries: 7,
    fifties: 50,
    highestScore: 113,
    recentForm: [45, 67, 12, 89, 34, 78, 23, 56, 91, 8],
  },
  'MS Dhoni': {
    matches: 250,
    runs: 5082,
    average: 39.70,
    strikeRate: 135.92,
    centuries: 0,
    fifties: 24,
    highestScore: 84,
    recentForm: [23, 56, 41, 18, 67, 34, 12, 45, 78, 29],
  },
};

export const fantasyPoints = {
  batting: { run: 1, four: 1, six: 2, fifty: 8, century: 16 },
  bowling: { wicket: 25, maiden: 12, dotBall: 1 },
  fielding: { catch: 8, stumping: 12, runOut: 8 },
};

export const playerClusters = [
  {
    name: 'Power Hitters',
    players: ['Andre Russell', 'Hardik Pandya', 'Glenn Maxwell', 'MS Dhoni'],
    avgStrikeRate: 145.2,
    avgFantasyPoints: 78.5,
    color: '#FF6B6B',
  },
  {
    name: 'Anchors',
    players: ['Virat Kohli', 'Rohit Sharma', 'Faf du Plessis', 'Shreyas Iyer'],
    avgStrikeRate: 128.4,
    avgFantasyPoints: 65.3,
    color: '#4ECDC4',
  },
  {
    name: 'Death Bowlers',
    players: ['Jasprit Bumrah', 'Rashid Khan', 'Mohammed Siraj', 'Pat Cummins'],
    avgEconomy: 7.2,
    avgFantasyPoints: 71.8,
    color: '#45B7D1',
  },
  {
    name: 'Spin Wizards',
    players: ['Ravindra Jadeja', 'Sunil Narine', 'Rashid Khan'],
    avgEconomy: 6.8,
    avgFantasyPoints: 68.9,
    color: '#96CEB4',
  },
];
