from fastapi import APIRouter, HTTPException
import pandas as pd
import os

router = APIRouter()

# Load cluster data at startup
DATA_DIR = os.path.join(os.path.dirname(__file__), '../services/data')
batter_clusters_path = os.path.join(DATA_DIR, 'batter_clusters.csv')
bowler_clusters_path = os.path.join(DATA_DIR, 'bowler_clusters.csv')

batter_df = pd.read_csv(batter_clusters_path)
batter_df.columns = [c.strip() for c in batter_df.columns]
print("Batter columns:", batter_df.columns.tolist())

bowler_df = pd.read_csv(bowler_clusters_path)
bowler_df.columns = [c.strip() for c in bowler_df.columns]
print("Bowler columns:", bowler_df.columns.tolist())

@router.get('/batters')
def get_batter_clusters():
    clusters = []
    for label, group in batter_df.groupby('cluster_label'):
        members = group['player'].tolist()
        avg_strike_rate = round(group['strike_rate'].mean(), 2)
        avg_4s = round(group['4s'].mean(), 2)
        avg_6s = round(group['6s'].mean(), 2)
        clusters.append({
            'cluster_label': label,
            'members': members,
            'avg_strike_rate': avg_strike_rate,
            'avg_4s': avg_4s,
            'avg_6s': avg_6s,
            'count': len(members)
        })
    return {'clusters': clusters}

@router.get('/batters/{player}')
def get_batter_cluster_for_player(player: str):
    row = batter_df[batter_df['player'].str.lower() == player.lower()]
    if row.empty:
        raise HTTPException(status_code=404, detail='Batter not found')
    r = row.iloc[0]
    return {
        'player': r['player'],
        'cluster': int(r['cluster']),
        'cluster_label': r['cluster_label'],
        'strike_rate': round(float(r['strike_rate']), 2),
        '4s': int(r['4s']),
        '6s': int(r['6s'])
    }

@router.get('/bowlers')
def get_bowler_clusters():
    clusters = []
    for label, group in bowler_df.groupby('cluster_label'):
        members = group['player'].tolist()
        avg_economy = round(group['economy'].mean(), 2)
        avg_wickets = round(group['wickets'].mean(), 2)
        clusters.append({
            'cluster_label': label,
            'members': members,
            'avg_economy': avg_economy,
            'avg_wickets': avg_wickets,
            'count': len(members)
        })
    return {'clusters': clusters}

@router.get('/bowlers/{player}')
def get_bowler_cluster_for_player(player: str):
    row = bowler_df[bowler_df['player'].str.lower() == player.lower()]
    if row.empty:
        raise HTTPException(status_code=404, detail='Bowler not found')
    r = row.iloc[0]
    return {
        'player': r['player'],
        'cluster': int(r['cluster']),
        'cluster_label': r['cluster_label'],
        'economy': round(float(r['economy']), 2),
        'wickets': int(r['wickets'])
    } 