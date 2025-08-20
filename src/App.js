import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import './App.css';

import Card from './components/Card';
import StatsBar from './components/StatsBar';
import GameOverScreen from './components/GameOverScreen';
import SearchBar from './components/SearchBar';

function App() {
  const [query, setQuery] = useState('');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [flipCount, setFlipCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    const stored = localStorage.getItem('bestTime');
    return stored ? parseInt(stored) : null;
  });
  const [showGameOverScreen, setShowGameOverScreen] = useState(false);

const UNSPLASH_ACCESS_KEY = process.env.REACT_APP_UNSPLASH_ACCESS_KEY; //make sure to replace with your own key

  // ------------------ Game Timer ------------------
  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime]);

  // ------------------ Game Over Handling ------------------
  useEffect(() => {
    if (matched.length === cards.length / 2 && cards.length > 0) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      setStartTime(null);

      if (bestTime === null || elapsedTime < bestTime) {
        setBestTime(elapsedTime);
        localStorage.setItem('bestTime', elapsedTime.toString());
      }

      const timeout = setTimeout(() => setShowGameOverScreen(true), 2000);
      return () => clearTimeout(timeout);
    }
  }, [matched, cards, elapsedTime, bestTime]);

  // ------------------ Helper Functions ------------------
  const initializeGame = (newCards = []) => {
    setCards(newCards);
    setFlipped([]);
    setMatched([]);
    setElapsedTime(0);
    setFlipCount(0);
    setStartTime(newCards.length ? Date.now() : null);
    setGameStarted(newCards.length > 0);
    setShowGameOverScreen(false);
    setQuery('');
  };

  const resetFlipped = (delay) => {
    setTimeout(() => {
      setFlipped([]);
      setDisabled(false);
    }, delay);
  };

  // ------------------ Fetch Images ------------------
  const fetchImages = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await res.json();
      const images = data.results.map((img) => ({ id: uuidv4(), src: img.urls.small }));

      const duplicated = images.flatMap((img) => [
        { ...img, uniqueId: uuidv4() },
        { ...img, uniqueId: uuidv4() },
      ]);
      const shuffled = duplicated.sort(() => Math.random() - 0.5);

      initializeGame(shuffled);
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ Card Click ------------------
  const handleClick = (card) => {
    if (disabled || flipped.find((f) => f.uniqueId === card.uniqueId) || matched.includes(card.src))
      return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setDisabled(true);
      setFlipCount((prev) => prev + 1);

      if (newFlipped[0].src === newFlipped[1].src) {
        setMatched([...matched, card.src]);
        resetFlipped(700);
      } else {
        resetFlipped(1000);
      }
    }
  };

  const resetGame = () => initializeGame([]);

  // ------------------ Render ------------------
  return (
    <div className="app">
      <h1>Memory Game Generator</h1>

      {!gameStarted && !showGameOverScreen && (
        <SearchBar query={query} setQuery={setQuery} fetchImages={fetchImages} loading={loading} />
      )}

      {showGameOverScreen ? (
        <GameOverScreen
          elapsedTime={elapsedTime}
          flipCount={flipCount}
          bestTime={bestTime}
          resetGame={resetGame}
        />
      ) : (
        <>
          {cards.length > 0 && <StatsBar matched={matched} flipCount={flipCount} elapsedTime={elapsedTime} />}

          <div className="grid">
            {cards.map((card) => {
              const isFlipped = flipped.find((f) => f.uniqueId === card.uniqueId) || matched.includes(card.src);
              return <Card key={card.uniqueId} card={card} handleClick={handleClick} isFlipped={isFlipped} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
