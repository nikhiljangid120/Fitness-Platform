"use client"

import React, { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

export function Confetti() {
    const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 })

    const detectSize = () => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight })
    }

    useEffect(() => {
        detectSize()
        window.addEventListener("resize", detectSize)
        return () => {
            window.removeEventListener("resize", detectSize)
        }
    }, [])

    if (windowDimension.width === 0) return null

    return (
        <ReactConfetti
            width={windowDimension.width}
            height={windowDimension.height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.15}
        />
    )
}
