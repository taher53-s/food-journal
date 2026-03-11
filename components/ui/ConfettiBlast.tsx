"use client";
import ReactConfetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useState, useEffect } from "react";

export function ConfettiBlast() {
    const { width, height } = useWindowSize();
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShow(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!show) return null;

    return (
        <ReactConfetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={400}
            gravity={0.15}
            colors={["#FCD34D", "#F59E0B", "#D97706", "#2D7D58", "#9DCAB0"]}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 100, pointerEvents: 'none' }}
        />
    );
}
