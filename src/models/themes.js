// WUBRG background themes, one per basic land. Backgrounds are layered CSS gradients
// (an optional subtle pattern on top of a base gradient), applied as inline styles by the view.
// All themes stay mid-to-dark (Plains: warm gold) because every UI panel that carries
// text sits on its own dark translucent surface, keeping contrast high in each theme.

export const THEMES = [
  {
    id: 'plains',
    name: 'Plains',
    manaName: 'White',
    icon: 'sun',
    buttonClass: 'bg-[#f8f1c8] text-amber-800',
    background: {
      backgroundImage:
        'repeating-linear-gradient(45deg, rgba(255,255,255,0.22) 0 2px, transparent 2px 24px), ' +
        'linear-gradient(135deg, #fff1bf 0%, #f0cd6b 50%, #d4a43a 100%)',
      backgroundSize: '100% 100%, 100% 100%',
    },
  },
  {
    id: 'island',
    name: 'Island',
    manaName: 'Blue',
    icon: 'drop',
    buttonClass: 'bg-[#2b7bd0] text-white',
    background: {
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), ' +
        'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), ' +
        'linear-gradient(135deg, #06203f 0%, #0b4a8b 55%, #1b86c8 100%)',
      backgroundSize: '40px 40px, 40px 40px, 100% 100%',
    },
  },
  {
    id: 'swamp',
    name: 'Swamp',
    manaName: 'Black',
    icon: 'skull',
    buttonClass: 'bg-[#2a2332] text-purple-200',
    background: {
      backgroundImage:
        'radial-gradient(circle at 20% 20%, rgba(168,128,255,0.18), transparent 45%), ' +
        'linear-gradient(135deg, #15111c 0%, #241b33 55%, #32244a 100%)',
      backgroundSize: '100% 100%, 100% 100%',
    },
  },
  {
    id: 'mountain',
    name: 'Mountain',
    manaName: 'Red',
    icon: 'flame',
    buttonClass: 'bg-[#d6402a] text-white',
    background: {
      backgroundImage:
        'repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0 2px, transparent 2px 26px), ' +
        'linear-gradient(135deg, #3a0f0c 0%, #8a2b1b 55%, #d8642b 100%)',
      backgroundSize: '100% 100%, 100% 100%',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    manaName: 'Green',
    icon: 'tree',
    buttonClass: 'bg-[#2c8a4a] text-white',
    background: {
      backgroundImage:
        'radial-gradient(rgba(255,255,255,0.07) 1.5px, transparent 1.5px), ' +
        'linear-gradient(135deg, #0d2617 0%, #1e5233 55%, #4a8238 100%)',
      backgroundSize: '28px 28px, 100% 100%',
    },
  },
];

export const DEFAULT_THEME_ID = 'swamp';
