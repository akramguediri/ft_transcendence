import React from 'react'
import { game } from '../../assets'

const GamePage = () => {
    return (
        <div>
            {/* Team/Auteur Section */}
            <section id="auteur" className="py-5 bg-secondary" >
                <div className="container" style={{ height: "100vh" }}>
                    <div className="row align-items-center">
                        <div className="col-md-6 mb-4 mb-md-0">
                            <img src={game} alt="ft_transcendence game screenshot" className="img-fluid rounded shadow-sm" />
                        </div>
                        <div className="col-md-6">
                            <div class="d-grid gap-2 col-6 mx-auto">
                                <button class="btn btn-primary" type="button">Play Game</button>
                                <button class="btn btn-danger" type="button">Play Tournement</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default GamePage