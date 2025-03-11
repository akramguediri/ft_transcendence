import React from 'react';
import { akram_picture, game, hama_picture, milad_picture } from '../assets';
import Navbar from './Navbar';
import styles from '../styles.css';

// Reusable TeamCard Component
const TeamCard = ({ image, name, description }) => (
  <div className="col-lg-3 col-md-6 mb-4">
    <div className="card effet-hover h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={`${name}'s Avatar`} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
      </div>
    </div>
  </div>
);

const HomePage = () => (
  <>
    {/* Navbar */}
    <header className="py-4">
      <Navbar />
    </header>

    {/* Hero Section */}
    <section id="toff">
      <div className="background-overlay">
        <div className="text-center">
          <h1>Welcome to our project ft_transcendence</h1>
        </div>
      </div>
    </section>

{/* Team/Auteur Section */}
<section id="auteur" className="py-5 bg-light">
  <div className="container">
    <div className="row align-items-center">
      <div className="col-md-6 mb-4 mb-md-0">
        <img src={game} alt="ft_transcendence game screenshot" className="img-fluid rounded shadow-sm" />
      </div>
      <div className="col-md-6">
        <h2 className="fw-bold mb-3">Our Game</h2>
        <p className="text-secondary lead mb-4">
          ft_transcendence game is a modern interpretation of the classic Pong game, featuring real-time multiplayer functionality, customizable paddles, and competitive leaderboards.
        </p>
        <div className="d-flex gap-3">
          <button className="btn btn-primary">Play Now</button>
        </div>
      </div>
    </div>
  </div>
</section>

    <section id="auteur" className="py-5 bg-light">
      <div className="container">
        {/* Team Intro */}
        <div className="row text-center mb-4">
          <div className="col">
            <h1 className="text-primary">The Team</h1>
            <p className="text-secondary">
              Meet our amazing team dedicated to building ft_transcendence.
            </p>
          </div>
        </div>

        {/* Team Members */}
        <div className="row">
          <TeamCard
            image={milad_picture}
            name="Milad"
          />
          <TeamCard
            image={hama_picture}
            name="Ihama"
          />
          <TeamCard
            image={akram_picture}
            name="Akram"
          />
        </div>
      </div>
    </section>
  </>
);

export default HomePage;
