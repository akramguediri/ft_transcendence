import React from 'react';
import { hero_42 } from '../assets';
import Navbar from './Navbar';
import styles from '../styles.css';


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
            <div
                className="background-overlay navbarStyle"
            >
                <div className="container text-center text-white">
                    <h1>Welcome to our project ft_transcendence</h1>
                </div>
            </div>
        </section>
    </>
);

export default HomePage;
