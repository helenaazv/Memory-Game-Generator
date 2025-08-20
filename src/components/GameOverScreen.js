import React from 'react';
import { formatTime } from '../utils/formatTime';

const GameOverScreen = ({ elapsedTime, flipCount, bestTime, resetGame }) => (
  <div className="game-over popup">
    <img src="/you-win.png" alt="You Win!" className="you-win-image" />
    <p className="yellow-text">
      Time to complete: <strong>{formatTime(elapsedTime)}</strong>
    </p>
    <p className="yellow-text">
      Number of flips: <strong>{flipCount}</strong>
    </p>
    <p className="yellow-text">
      Best time: <strong>{bestTime !== null ? formatTime(bestTime) : 'N/A'}</strong>
    </p>

    <button onClick={resetGame} className="btn btn-pink play-again-button">
      Play Again
    </button>
  </div>
);

export default GameOverScreen;

