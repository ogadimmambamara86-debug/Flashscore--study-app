"use client";

import React, { useCallback } from "react";
import Particles from "react-particles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

const BackgroundParticles: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: {
          enable: true,
          zIndex: -1 // make sure particles stay behind your content
        },
        background: {
          color: { value: "#0a0a0a" }
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
            resize: true
          },
          modes: {
            repulse: { distance: 100, duration: 0.4 },
            push: { quantity: 4 }
          }
        },
        particles: {
          color: { value: "#ffffff" },
          links: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 },
          collisions: { enable: false },
          move: { direction: "none", enable: true, outModes: { default: "bounce" }, speed: 2 },
          number: { value: 50, density: { enable: true, area: 800 } },
          opacity: { value: 0.5 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 5 } }
        },
        detectRetina: true
      }}
    />
  );
};

export default BackgroundParticles;