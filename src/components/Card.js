import React from 'react';

const Card = ({ card, handleClick, isFlipped }) => (
  <div className="card" onClick={() => handleClick(card)}>
    <div className={`card-inner ${isFlipped ? 'flipped' : ''}`}>
      <div className="card-front">
        <img src="/card-back.png" alt="Back" />
      </div>
      <div className="card-back">
        <img src={card.src} alt="Card" />
      </div>
    </div>
  </div>
);

export default Card;

