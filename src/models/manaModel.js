// Mana pool and mana cost helpers. Framework-free and pure.
// Costs are strings like "2 W U B R G": numbers are generic mana, letters are colored mana.

export const MANA_COLORS = ['W', 'U', 'B', 'R', 'G'];

// Display info per color (Tailwind classes live with the data, like the card database).
export const MANA_INFO = {
  W: { name: 'White', land: 'Plains', className: 'bg-[#f8f1c8] text-amber-900 border-amber-700/40' },
  U: { name: 'Blue', land: 'Island', className: 'bg-[#2b7bd0] text-white border-blue-900/50' },
  B: { name: 'Black', land: 'Swamp', className: 'bg-[#2a2332] text-purple-200 border-stone-500' },
  R: { name: 'Red', land: 'Mountain', className: 'bg-[#d6402a] text-white border-red-900/50' },
  G: { name: 'Green', land: 'Forest', className: 'bg-[#2c8a4a] text-white border-green-900/50' },
};

export const emptyManaPool = () => ({ W: 0, U: 0, B: 0, R: 0, G: 0 });

export const totalMana = (pool) => MANA_COLORS.reduce((sum, c) => sum + pool[c], 0);

/** "2 W U" -> { generic: 2, colored: { W: 1, U: 1, B: 0, R: 0, G: 0 } } */
export const parseManaCost = (cost = '') => {
  const colored = emptyManaPool();
  let generic = 0;
  cost.split(/\s+/).filter(Boolean).forEach(token => {
    if (/^\d+$/.test(token)) generic += Number(token);
    else if (token in colored) colored[token] += 1;
  });
  return { generic, colored };
};

/** Total mana value of a cost string. */
export const manaValue = (cost) => {
  const { generic, colored } = parseManaCost(cost);
  return generic + totalMana(colored);
};

/**
 * Pay a cost from the pool. Colored mana is paid by color; generic mana is paid
 * from whatever is left, taking from the largest stacks first.
 * Returns the new pool, or null if the pool can't afford it.
 */
export const payCost = (pool, cost) => {
  const { generic, colored } = parseManaCost(cost);
  const next = { ...pool };

  for (const color of MANA_COLORS) {
    if (next[color] < colored[color]) return null;
    next[color] -= colored[color];
  }

  let remaining = generic;
  while (remaining > 0) {
    const richest = MANA_COLORS.reduce((best, c) => (next[c] > next[best] ? c : best), MANA_COLORS[0]);
    if (next[richest] === 0) return null;
    next[richest] -= 1;
    remaining -= 1;
  }

  return next;
};

export const canPay = (pool, cost) => payCost(pool, cost) !== null;
