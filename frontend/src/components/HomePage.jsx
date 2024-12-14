import React from 'react';
import { hero_42 } from '../assets';
import Navbar from './Navbar';


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
                className="background-overlay"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                }}
            >
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
