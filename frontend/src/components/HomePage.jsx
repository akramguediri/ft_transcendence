import React, { useEffect } from 'react';
import { akram_picture, anass_picture, hama_picture, hero_42, milad_picture } from '../assets';
import Navbar from './Navbar';
import styles from '../styles.css';
import Get42Token from './user_management/Get42Token';
import { useNavigate } from 'react-router-dom';

const socialLinks = [
  { platform: 'linkedin', icon: 'bi bi-linkedin' },
  { platform: 'instagram', icon: 'bi bi-instagram' },
  { platform: 'twitter', icon: 'bi bi-twitter' },
];

// Reusable TeamCard Component
const TeamCard = ({ image, name, description }) => (
  <div className="col-lg-3 col-md-6 mb-4">
    <div className="card effet-hover h-100 shadow-sm">
      <img src={image} className="card-img-top" alt={`${name}'s Avatar`} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <div className="d-flex justify-content-center">
          <ul className="list-inline">
            {socialLinks.map((link, index) => (
              <li className="list-inline-item" key={index}>
                <i className={`${link.icon} text-primary`} title={link.platform}></i>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const HomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
        Get42Token(code)
    }
}, [navigate]);


  return (
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

      {/* Team Section */}
      <section id="auteur" className="py-5 bg-light">
        <div className="container">
          {/* Team Intro */}
          <div className="row text-center mb-4">
            <div className="col">
              <h1 className="text-primary">The Team</h1>
              <p>
                Meet our amazing team dedicated to building ft_transcendence. Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Dignissimos minima fuga quaerat provident itaque quas eligendi praesentium.
              </p>
            </div>
          </div>

          {/* Team Members */}
          <div className="row">
            <TeamCard
              image={milad_picture}
              name="Milad"
              description="Milad is a passionate developer with expertise in fullstack development."
            />
            <TeamCard
              image={hama_picture}
              name="Ihama"
              description="Ihama specializes in Frontend development, ensuring a seamless user experience for all users."
            />
            <TeamCard
              image={akram_picture}
              name="Akram"
              description="Akram is our backend wizard."
            />
            <TeamCard
              image={anass_picture}
              name="Anass"
              description="Anass is the go-to person for DevOps and ensuring smooth deployments."
            />
          </div>
        </div>
      </section>
    </>
  )
};

export default HomePage;
