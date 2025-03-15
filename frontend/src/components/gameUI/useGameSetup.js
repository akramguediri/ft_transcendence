import { useState, useEffect, useRef } from "react";

export const useGameSetup = () => {
    const [keys, setKeys] = useState({
        w: false,
        s: false,
        ArrowUp: false,
        ArrowDown: false,
    });
    
    const keysRef = useRef(keys);
    const socketRef = useRef(null);

    // Sync keysRef with keys state
    useEffect(() => {
        keysRef.current = keys;
    }, [keys]);

    // Keyboard handlers
    useEffect(() => {
        const handleKey = (e, isKeyDown) => {
            if (["w", "s", "ArrowUp", "ArrowDown"].includes(e.key)) {
                e.preventDefault();
                setKeys(prev => ({ ...prev, [e.key]: isKeyDown }));
            }
        };

        const keyDown = (e) => handleKey(e, true);
        const keyUp = (e) => handleKey(e, false);

        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
        return () => {
            window.removeEventListener("keydown", keyDown);
            window.removeEventListener("keyup", keyUp);
        };
    }, []);

    return { keys, keysRef, socketRef };
};