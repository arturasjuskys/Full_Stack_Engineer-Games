import { animals } from './animals';
import React from 'react';
import ReactDOM from 'react-dom';

const title = '';
const background = <img className="background" alt="ocean" src='/images/ocean.jpg' />
const showBackground = true;
const images = [];
const displayFact = function (e) {
  // getting animal name
  const selectedAnimal = e.target.alt;
  const randNum = Math.floor(Math.random() * animals[selectedAnimal].facts.length);
  const fact = animals[selectedAnimal].facts[randNum];
  document.getElementById('fact').innerHTML = fact;
};
for (const animal in animals) {
  // collects images
  images.push(<img key={animal} className='animal' alt={animal} src={animals[animal].image} aria-label={animal} role='button' onClick={displayFact} />);
};
const animalFacts = (
  <div>
    <h1>{ title || 'Click an animal for a fun fact' }</h1>
    {showBackground && background}
    <div className='animals'>
      {/* displaying images */}
      {images}
      <p id="fact"></p>
    </div>
  </div>
);


ReactDOM.render(animalFacts, document.getElementById('root'));
