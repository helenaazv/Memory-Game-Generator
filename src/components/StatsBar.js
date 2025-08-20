import React from 'react';
import { formatTime } from '../utils/formatTime';

const StatsBar = ({ matched, flipCount, elapsedTime }) => (
  <div className="stats-bar">
    <div className="stat-item">
      <span className="stat-emoji">🏅</span> Score: {matched.length}
    </div>
    <div className="stat-item">
      <span className="stat-emoji">🔄</span> Flips: {flipCount}
    </div>
    <div className="stat-item">
      <span className="stat-emoji">⏱️</span> Timer: {formatTime(elapsedTime)}
    </div>
  </div>
);

export default StatsBar;
