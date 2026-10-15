import React from 'react';
import { useGameController } from './controllers/useGameController.js';
import GameBoardView from './views/pages/GameBoardView.jsx';

export default function App() {
  const game = useGameController();
  return <GameBoardView game={game} />;
}
