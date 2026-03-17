export interface RankDef {
  index: number;
  name: string;
  xpRequired: number;
}

export const RANKS: RankDef[] = [
  { index: 1, name: 'Nobody', xpRequired: 0 },
  { index: 2, name: 'Street Rat', xpRequired: 120 },
  { index: 3, name: 'Runner', xpRequired: 320 },
  { index: 4, name: 'Earner', xpRequired: 620 },
  { index: 5, name: 'Crewman', xpRequired: 980 },
  { index: 6, name: 'Soldier', xpRequired: 1450 },
  { index: 7, name: 'Capo', xpRequired: 2050 },
  { index: 8, name: 'Underboss', xpRequired: 2850 },
  { index: 9, name: 'Boss', xpRequired: 3900 },
  { index: 10, name: 'Godfather', xpRequired: 5400 },
];

export const getRankByXp = (xp: number): RankDef => {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (xp >= rank.xpRequired) current = rank;
  }
  return current;
};

export const getNextRank = (xp: number): RankDef | undefined => {
  const current = getRankByXp(xp);
  return RANKS.find((r) => r.index === current.index + 1);
};
