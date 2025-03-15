const getApiUrl = () => {
    try {
        const protocol = window.location.protocol || "http:";
        let hostname = window.location.hostname || "localhost";

        hostname = hostname.replace(/\/$/, "").trim();

        return `${protocol}//${hostname}:8000`;
    } catch (error) {
        console.error("Error generating API URL:", error);
        return "http://localhost:8000"; // Safe fallback
    }
};

const API_URL = getApiUrl();

export default API_URL;
