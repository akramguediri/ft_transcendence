import React from 'react';
import { Link } from 'react-router-dom';
import { hero_42 } from '../assets';

const Navbar = () => (
    <nav className="navbar navbar-expand-md bg-light navbar-light fixed-top">
        <div className="container">
            <a className="navbar-brand fw-bold" href="/index.html">
                <span className="bg-primary bg-gradient p-1 rounded-3 text-light">ft_</span>transcendence
            </a>
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/home-page">Home</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/profile">Profile</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/game">Game</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/invitation">Invitation</Link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
);

const HomePage = () => (
    <>
    <header className="py-4">
        <Navbar />
    </header>
    <section
        id="toff"
        style={{
            background: `url(${hero_42}) no-repeat center center/cover fixed`,
            height: '100vh',
        }}
    >
        <div className="background-overlay" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
        }}>
            <div className="container text-center text-white">
                <h1>Welcome to our project ft_transcendence</h1>
                <p>
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptates consectetur ex tenetur ullam
                    laudantium nihil vel in, recusandae aliquid, dolor maxime repellendus quam, obcaecati fuga
                    exercitationem iure officia fugit. Obcaecati.
                </p>
            </div>
        </div>
    </section>
</>

);


export default HomePage;
