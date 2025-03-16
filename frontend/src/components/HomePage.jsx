import React, { useEffect, useRef, useState } from 'react';
import { akram_picture, game, hama_picture, mounir_picture, } from '../assets'; // Removed milad_picture
import Navbar from './Navbar';
import styles from '../styles.css';
import { Link } from 'react-router-dom';
import Get42Token from './42API/Get42Token';
import { Engine, Scene, MeshBuilder, Vector3, HemisphericLight, ArcRotateCamera } from '@babylonjs/core';
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

// Babylon.js 3D Ping Pong Ball Component
const PingPongBall3D = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const engine = new Engine(canvasRef.current, true);
      const scene = new Scene(engine);

      // Create a camera
      const camera = new ArcRotateCamera(
        'camera',
        Math.PI / 2,
        Math.PI / 4,
        10,
        Vector3.Zero(),
        scene
      );
      camera.attachControl(canvasRef.current, true);

      // Create a light
      const light = new HemisphericLight('light', new Vector3(1, 1, 0), scene);
      light.intensity = 0.7;

      // Create a 3D ping pong ball
      const ball = MeshBuilder.CreateSphere('ball', { diameter: 1 }, scene);
      ball.position = new Vector3(0, 0, 0);

      // Animation variables
      let direction = new Vector3(1, 1, 0).normalize();
      const speed = 0.05;

      // Render loop
      engine.runRenderLoop(() => {
        // Update ball position
        ball.position.addInPlace(direction.scale(speed));

        // Check for collision with boundaries
        if (ball.position.x > 5 || ball.position.x < -5) {
          direction.x *= -1;
        }
        if (ball.position.y > 5 || ball.position.y < -5) {
          direction.y *= -1;
        }
        if (ball.position.z > 5 || ball.position.z < -5) {
          direction.z *= -1;
        }

        // Render the scene
        scene.render();
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        engine.resize();
      });

      // Cleanup
      return () => {
        engine.dispose();
      };
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '8px', // Optional: Add rounded corners to match the image style
      }}
    />
  );
};

const HomePage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      // Call Get42Token to exchange the code for an access token and fetch user info
      Get42Token(code)
        .then((userData) => {
          setUserData(userData);
        })
        .catch((error) => {
          console.error('Error:', error.message);
          // Handle error (e.g., show an error message to the user)
        });
    }
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className="py-4">
        <Navbar />
      </header>

      {/* Hero Section */}
      <section id="toff" className="position-relative text-center text-white">
        <div
          className="background-overlay d-flex align-items-center justify-content-center"
          style={{ height: '100vh' }}
        >
          <div>
            <h1 className="display-4 fw-bold">
              Welcome to <span className="text-primary">ft_transcendence</span>
            </h1>
            <p className="lead mt-3">
              Experience the next generation of Pong with real-time multiplayer and competitive
              leaderboards.
            </p>
            <Link to="/game">
              <button className="btn btn-primary btn-lg mt-3">Start Playing</button>
            </Link>
          </div>
        </div>
      </section>

      {/* User Profile Section */}
      {userData && (
        <section id="profile" className="py-5 bg-light">
          <div className="container text-center">
            <h2 className="fw-bold mb-3">Welcome, {userData.name}!</h2>
            <img
              src={userData.avatar}
              alt={`${userData.name}'s Avatar`}
              className="img-fluid rounded-circle mb-3"
              style={{ width: '150px', height: '150px' }}
            />
            <p className="lead">Email: {userData.email}</p>
          </div>
        </section>
      )}

      {/* Team/Auteur Section */}
      <section id="auteur" className="py-5 bg-secondary">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Replace the game image with the 3D animation canvas */}
              <div style={{ width: '100%', height: '400px', borderRadius: '8px', overflow: 'hidden' }}>
                <PingPongBall3D />
              </div>
            </div>
            <div className="col-md-6">
              <h2 className="fw-bold mb-3">Our Game</h2>
              <p className="text-white lead mb-4">
                ft_transcendence game is a modern interpretation of the classic Pong game,
                featuring real-time multiplayer functionality, customizable paddles, and competitive
                leaderboards.
              </p>
              <div className="d-flex gap-3">
                <Link to="/game">
                  <button className="btn btn-primary">Play Now</button>
                </Link>
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
            <TeamCard image={hama_picture} name="Hamma" />
            <TeamCard image={akram_picture} name="Akram" />
            <TeamCard image={mounir_picture} name="Mounir" />
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;