import { useState } from "react";

export const useNetwork = (socketRef, setGameMode) => {
    const [networkError, setNetworkError] = useState("");
    const [networkStatus, setNetworkStatus] = useState("");
    const [localNetworkId, setLocalNetworkId] = useState("");
    const [joinNetworkId, setJoinNetworkId] = useState("");

    const connectToWebSocket = (gameId) => {
        const ws = new WebSocket(`ws://localhost:8000/ws/game/${gameId}/`);

        ws.onopen = () => {
            socketRef.current = ws;
            setGameMode("online");
            setNetworkStatus(`Connected to game ID: ${gameId}`);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Handle incoming game state updates here
            } catch (error) {
                console.error("WebSocket error:", error);
            }
        };

        ws.onerror = (error) => {
            setNetworkError("Connection failed");
            console.error("WebSocket error:", error);
        };

        return ws;
    };

    const hostNetworkGame = () => {
        if (!localNetworkId.trim()) return setNetworkError("Enter game ID to host");
        connectToWebSocket(localNetworkId);
    };

    const connectToNetworkGame = () => {
        if (!joinNetworkId.trim()) return setNetworkError("Enter game ID to join");
        connectToWebSocket(joinNetworkId);
    };

    return {
        networkError,
        networkStatus,
        localNetworkId,
        joinNetworkId,
        setLocalNetworkId,
        setJoinNetworkId,
        hostNetworkGame,
        connectToNetworkGame
    };
};