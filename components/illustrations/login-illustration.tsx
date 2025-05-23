"use client";

import { useEffect, useRef } from "react";

export default function LoginIllustration() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (svgRef.current) {
      // Floating animation
      const floatingElements = svgRef.current.querySelectorAll(".animate-float");
      floatingElements.forEach((el, index) => {
        const delay = index * 0.2;
        const duration = 3 + Math.random() * 2;

        el.animate(
          [{ transform: "translateY(0px)" }, { transform: "translateY(-10px)" }, { transform: "translateY(0px)" }],
          {
            duration: duration * 1000,
            iterations: Number.POSITIVE_INFINITY,
            easing: "ease-in-out",
            delay: delay * 1000,
          },
        );
      });

      // Pulse animation
      const pulseElements = svgRef.current.querySelectorAll(".animate-pulse");
      pulseElements.forEach((el, index) => {
        const delay = index * 0.3;

        el.animate(
          [
            { opacity: 0.7, transform: "scale(0.95)" },
            { opacity: 1, transform: "scale(1.05)" },
            { opacity: 0.7, transform: "scale(0.95)" },
          ],
          {
            duration: 3000,
            iterations: Number.POSITIVE_INFINITY,
            easing: "ease-in-out",
            delay: delay * 1000,
          },
        );
      });

      // Rotate animation
      const rotateElements = svgRef.current.querySelectorAll(".animate-rotate");
      rotateElements.forEach((el, index) => {
        const delay = index * 0.5;
        const direction = index % 2 === 0 ? 1 : -1;

        el.animate([{ transform: "rotate(0deg)" }, { transform: `rotate(${360 * direction}deg)` }], {
          duration: 20000,
          iterations: Number.POSITIVE_INFINITY,
          easing: "linear",
          delay: delay * 1000,
        });
      });
    }
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-2xl mx-auto"
    >
      {/* Background Gradient */}
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4338CA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C084FC" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#C084FC" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Main Background */}
      <rect width="800" height="600" fill="url(#bgGradient)" />

      {/* Background Particles */}
      <g className="animate-float">
        <circle cx="100" cy="100" r="50" fill="url(#glowGradient)" opacity="0.3" />
        <circle cx="700" cy="500" r="70" fill="url(#glowGradient)" opacity="0.3" />
        <circle cx="200" cy="500" r="40" fill="url(#glowGradient)" opacity="0.2" />
        <circle cx="600" cy="200" r="60" fill="url(#glowGradient)" opacity="0.2" />
      </g>

      {/* Abstract Background Elements */}
      <path d="M0 300 Q 400 200, 800 300 Q 400 400, 0 300" fill="#4C1D95" opacity="0.2" className="animate-float" />
      <path d="M0 350 Q 400 250, 800 350 Q 400 450, 0 350" fill="#6D28D9" opacity="0.2" className="animate-float" />

      {/* Circular Glow */}
      <circle cx="400" cy="300" r="200" fill="url(#circleGlow)" className="animate-pulse" />

      {/* Decorative Circles */}
      <circle cx="150" cy="150" r="10" fill="#C084FC" opacity="0.7" className="animate-float" />
      <circle cx="650" cy="450" r="8" fill="#C084FC" opacity="0.7" className="animate-float" />
      <circle cx="700" cy="150" r="12" fill="#C084FC" opacity="0.7" className="animate-float" />
      <circle cx="100" cy="450" r="15" fill="#C084FC" opacity="0.7" className="animate-float" />

      {/* Decorative Lines */}
      <path d="M100 200 L150 250" stroke="#C084FC" strokeWidth="2" opacity="0.7" />
      <path d="M650 200 L600 250" stroke="#C084FC" strokeWidth="2" opacity="0.7" />
      <path d="M100 400 L150 350" stroke="#C084FC" strokeWidth="2" opacity="0.7" />
      <path d="M650 400 L600 350" stroke="#C084FC" strokeWidth="2" opacity="0.7" />

      {/* Central Elements */}
      <g className="animate-float">
        {/* Central Circle */}
        <circle cx="400" cy="250" r="120" fill="#312E81" opacity="0.9" />
        <circle cx="400" cy="250" r="115" fill="#1E1B4B" opacity="0.9" />

        {/* Progress Ring */}
        <circle cx="400" cy="250" r="100" fill="none" stroke="#4C1D95" strokeWidth="8" opacity="0.5" />
        <path
          d="M400 150 A100 100 0 1 1 300 250 A100 100 0 0 1 400 150"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="8"
          strokeDasharray="628"
          strokeDashoffset="157"
        />

        {/* Inner Content */}
        <text x="400" y="240" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">
          75%
        </text>
        <text x="400" y="270" fontSize="14" fill="#C084FC" textAnchor="middle">
          完了
        </text>
      </g>

      {/* People Silhouettes */}
      <g className="animate-float">
        {/* Person 1 - Business */}
        <circle cx="200" cy="200" r="30" fill="#4C1D95" className="animate-pulse" />
        <path d="M185 190 L215 190" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M185 200 L215 200" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M185 210 L205 210" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        {/* Person 2 - Creative */}
        <circle cx="600" cy="200" r="30" fill="#6D28D9" className="animate-pulse" />
        <path d="M585 190 A15 15 0 0 1 615 190" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M590 205 L610 205" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="590" cy="195" r="3" fill="white" />
        <circle cx="610" cy="195" r="3" fill="white" />
      </g>

      <g className="animate-float">
        {/* Person 3 - Education */}
        <circle cx="200" cy="400" r="30" fill="#7C3AED" className="animate-pulse" />
        <path d="M185 395 L215 395" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M200 380 L200 410" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M190 405 L210 405" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        {/* Person 4 - Healthcare */}
        <circle cx="600" cy="400" r="30" fill="#8B5CF6" className="animate-pulse" />
        <path d="M590 390 L610 410" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M610 390 L590 410" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="600" cy="400" r="10" fill="none" stroke="white" strokeWidth="2" />
      </g>

      {/* Connecting Lines */}
      <path d="M300 250 C 270 250, 270 200, 230 200" stroke="#C084FC" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M500 250 C 530 250, 530 200, 570 200" stroke="#C084FC" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M300 250 C 270 250, 270 400, 230 400" stroke="#C084FC" strokeWidth="2" strokeDasharray="5,5" />
      <path d="M500 250 C 530 250, 530 400, 570 400" stroke="#C084FC" strokeWidth="2" strokeDasharray="5,5" />

      {/* Floating Icons */}
      <g className="animate-float">
        <rect x="100" y="250" width="60" height="60" rx="10" fill="#1E1B4B" opacity="0.9" />
        <path d="M130 265 L130 295" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
        <path d="M115 280 L145 280" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        <rect x="640" y="250" width="60" height="60" rx="10" fill="#1E1B4B" opacity="0.9" />
        <circle cx="670" cy="280" r="15" fill="none" stroke="#C084FC" strokeWidth="3" />
        <path d="M670 265 L670 275" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
        <path d="M670 285 L670 295" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
        <path d="M655 280 L665 280" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
        <path d="M675 280 L685 280" stroke="#C084FC" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* Decorative Elements */}
      <g className="animate-rotate" transform="translate(150, 300)">
        <path d="M0 -20 L5 -5 L20 -5 L10 5 L15 20 L0 10 L-15 20 L-10 5 L-20 -5 L-5 -5 Z" fill="#C084FC" opacity="0.7" />
      </g>

      <g className="animate-rotate" transform="translate(650, 300)">
        <path d="M0 -20 L5 -5 L20 -5 L10 5 L15 20 L0 10 L-15 20 L-10 5 L-20 -5 L-5 -5 Z" fill="#C084FC" opacity="0.7" />
      </g>

      {/* Glowing Dots */}
      <circle cx="200" cy="150" r="3" fill="white" filter="url(#glow)" />
      <circle cx="600" cy="150" r="3" fill="white" filter="url(#glow)" />
      <circle cx="200" cy="450" r="3" fill="white" filter="url(#glow)" />
      <circle cx="600" cy="450" r="3" fill="white" filter="url(#glow)" />

      {/* Japanese Text */}
      <text x="400" y="500" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">
        パンダカフェー
      </text>
    </svg>
  );
}
