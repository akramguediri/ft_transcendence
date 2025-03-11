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
    {/* Hero Section */}
    <section id="toff" className="position-relative text-center text-white">
      <div className="background-overlay d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <div>
          <h1 className="display-4 fw-bold">Welcome to <span className="text-primary">ft_transcendence</span></h1>
          <p className="lead mt-3">
            Experience the next generation of Pong with real-time multiplayer and competitive leaderboards.
          </p>
          <button className="btn btn-primary btn-lg mt-3">Start Playing</button>
        </div>
      </div>
    </section>

    {/* Team/Auteur Section */}
    <section id="auteur" className="py-5 bg-secondary">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            <img src={game} alt="ft_transcendence game screenshot" className="img-fluid rounded shadow-sm" />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Our Game</h2>
            <p className="text-white lead mb-4">
              ft_transcendence game is a modern interpretation of the classic Pong game, featuring real-time multiplayer functionality, customizable paddles, and competitive leaderboards.
            </p>
            <div className="d-flex gap-3">
              <button className="btn btn-primary">Play Now</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="auteur" className="py-5 bg-dark">
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
