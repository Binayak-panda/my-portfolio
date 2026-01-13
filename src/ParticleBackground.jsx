import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async engine => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      className="absolute inset-0 -z-0"
      init={particlesInit}
      options={{
        fullScreen: { enable: false },
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "grab",
            },
            resize: true,
          },
          modes: {
            grab: {
              distance: 200, // Increased interaction range
              links: {
                opacity: 0.8, // Stronger link on hover
                color: "#22d3ee" // Cyan connection on hover
              }
            },
          },
        },
        particles: {
          color: {
            value: ["#22d3ee", "#a855f7", "#ffffff"], // Added white for extra brightness
          },
          links: {
            color: "#ffffff",
            distance: 150,
            enable: true,
            opacity: 0.3, // INCREASED VISIBILITY (was 0.1)
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1.2, // Slightly faster movement for more "life"
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 120, // More particles
          },
          opacity: {
            value: 0.7, // INCREASED BRIGHTNESS (was 0.4)
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 2, max: 4 }, // Slightly larger dots
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;