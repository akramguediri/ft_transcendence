import React, { useEffect, useRef, useState } from "react";
import styles from "./background.module.css"
import Ball from "./ball"
import Paddle from "./paddle";

const Background = () => {
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [player1Name, setPlayer1Name] = useState('Player 1');
    const [player2Name, setPlayer2Name] = useState('Player 2');
    const canvasRef = useRef();
    const borderHeight = 10
    const ballRadius = 14
    const sideWallRatio = 0.4
    const initialSpeed = 4
    const paddleHeight = 65
    const width = 1920
    const height = 1080

    const keys = { w: false, s: false, ArrowUp: false, ArrowDown: false };

    const handleKeyDown = (e) => {
      if (e.key in keys) keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      if (e.key in keys) keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.height = height;
        canvas.width = width;
        const ball = new Ball(canvas.width / 2, canvas.height / 2,initialSpeed,initialSpeed,ballRadius,borderHeight,sideWallRatio,canvas);
        const player1 = new Paddle(borderHeight + 5, canvas.height / 2, borderHeight, paddleHeight,"Hama",canvas);
        const player2 = new Paddle( canvas.width - 2 * borderHeight - 5, canvas.height / 2, borderHeight, paddleHeight,"Ekrem",canvas);
        setPlayer1Name(player1.getName())
        setPlayer2Name(player2.getName())

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const checkHit = () => {
            if
                (ball.getX() - ball.getR() < player1.getX() + player1.getWidth() &&
                    ball.getY() > player1.getY() &&
                    ball.getY() < player1.getY() + player1.getHeight())
            {
                ball.setVx(-ball.getVx());
                ball.setKicker(player1);
            } else if (ball.getX() + ball.getR() > player2.getX() &&
                    ball.getY() > player2.getY() &&
                    ball.getY() < player2.getY() + player2.getHeight())
            {
                ball.setVx(-ball.getVx());
                ball.setKicker(player2);
            }
        }

        const checkGoal = () => {
            if (ball.getY() + ball.getVy() > canvas.height * sideWallRatio * 0.5 + ball.getR() && ball.getY() + ball.getVy() < canvas.height * (1 - sideWallRatio / 2) - ball.getR()) {
                if (ball.getX() + ball.getVx() > canvas.width - ball.getR()) {
                    ball.reset();
                    ball.setVx(-ball.getVx());
                    player1.addScore();
                    setScore1(player1.getScore());
                } else if (ball.getX() + ball.getVx() < ball.getR()) {
                    ball.reset();
                    ball.setVx(-ball.getVx());
                    player2.addScore();
                    setScore2(player2.getScore());
                }
            }
        }

        const gameLoop = () => {
            ctx.clearRect(borderHeight, borderHeight, canvas.width - 2 * borderHeight, canvas.height - 2 * borderHeight);
            ctx.clearRect(0, canvas.height * 0.5 * sideWallRatio, canvas.width, canvas.height * (1 - sideWallRatio));

            player1.update(keys.w, keys.s);
            player2.update(keys.ArrowUp, keys.ArrowDown);

            checkHit();
            checkGoal();

            ball.update();
      
            player1.draw();
            player2.draw();
            ball.draw();

            requestAnimationFrame(gameLoop);
        };
      
        gameLoop();

    }, [])

    return (
        
        <div className={styles.wrapper}>
            <div className={styles.score_board}>
                <div className={styles.player}>
                    {player1Name}
                </div>
                <div className={styles.score}>
                    {score1} : {score2}
                </div>
                <div className={styles.player}>
                    {player2Name}
                </div>
            </div>
            <canvas ref={canvasRef} className={styles.canvas}></canvas>
        </div>
    )
}

export default Background