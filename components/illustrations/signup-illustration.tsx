"use client";

import { useEffect, useRef } from "react";

export default function SignupIllustration() {
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

      // Progress animation
      const progressElements = svgRef.current.querySelectorAll(".animate-progress");
      progressElements.forEach((el) => {
        const svgElement = el as SVGPathElement;
        const length = svgElement.getTotalLength();

        el.animate([{ strokeDashoffset: length }, { strokeDashoffset: 0 }], {
          duration: 2000,
          fill: "forwards",
          easing: "ease-out",
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
          <stop offset="0%" stopColor="#0F2942" />
          <stop offset="100%" stopColor="#1E3A5F" />
        </linearGradient>
        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
        </linearGradient>
        <radialGradient id="circleGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
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
      <path d="M0 300 Q 400 200, 800 300 Q 400 400, 0 300" fill="#1E3A5F" opacity="0.2" className="animate-float" />
      <path d="M0 350 Q 400 250, 800 350 Q 400 450, 0 350" fill="#2C4F7C" opacity="0.2" className="animate-float" />

      {/* Circular Glow */}
      <circle cx="400" cy="300" r="200" fill="url(#circleGlow)" className="animate-pulse" />

      {/* Decorative Circles */}
      <circle cx="150" cy="150" r="10" fill="#60A5FA" opacity="0.7" className="animate-float" />
      <circle cx="650" cy="450" r="8" fill="#60A5FA" opacity="0.7" className="animate-float" />
      <circle cx="700" cy="150" r="12" fill="#60A5FA" opacity="0.7" className="animate-float" />
      <circle cx="100" cy="450" r="15" fill="#60A5FA" opacity="0.7" className="animate-float" />

      {/* Decorative Lines */}
      <path d="M100 200 L150 250" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
      <path d="M650 200 L600 250" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
      <path d="M100 400 L150 350" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />
      <path d="M650 400 L600 350" stroke="#60A5FA" strokeWidth="2" opacity="0.7" />

      {/* Journey Path */}
      <g className="animate-float">
        <path
          d="M150 150 C 200 150, 200 200, 250 200 C 300 200, 300 250, 350 250 C 400 250, 400 300, 450 300 C 500 300, 500 350, 550 350 C 600 350, 600 400, 650 400"
          stroke="#3B82F6"
          strokeWidth="3"
          fill="none"
          className="animate-progress"
          strokeDasharray="1000"
          strokeDashoffset="1000"
        />

        {/* Journey Points */}
        <circle cx="150" cy="150" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="150" y="155" fontSize="10" fill="white" textAnchor="middle">
          開始
        </text>

        <circle cx="250" cy="200" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="250" y="205" fontSize="10" fill="white" textAnchor="middle">
          登録
        </text>

        <circle cx="350" cy="250" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="350" y="255" fontSize="10" fill="white" textAnchor="middle">
          学習
        </text>

        <circle cx="450" cy="300" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="450" y="305" fontSize="10" fill="white" textAnchor="middle">
          実践
        </text>

        <circle cx="550" cy="350" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="550" y="355" fontSize="10" fill="white" textAnchor="middle">
          評価
        </text>

        <circle cx="650" cy="400" r="15" fill="#0F2942" stroke="#3B82F6" strokeWidth="2" />
        <text x="650" y="405" fontSize="10" fill="white" textAnchor="middle">
          完了
        </text>
      </g>

      {/* People Silhouettes */}
      <g className="animate-float">
        {/* Person 1 - Business */}
        <circle cx="200" cy="300" r="25" fill="#0F2942" className="animate-pulse" />
        <path d="M190 295 L210 295" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M190 305 L210 305" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M190 315 L205 315" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        {/* Person 2 - Creative */}
        <circle cx="600" cy="300" r="25" fill="#1E3A5F" className="animate-pulse" />
        <path d="M590 295 A10 10 0 0 1 610 295" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M595 305 L605 305" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <circle cx="595" cy="298" r="2" fill="white" />
        <circle cx="605" cy="298" r="2" fill="white" />
      </g>

      {/* Calendar */}
      <g className="animate-float">
        <rect x="150" y="450" width="120" height="100" rx="5" fill="#0F2942" />
        <rect x="155" y="455" width="110" height="90" rx="3" fill="#0F172A" />

        <rect x="155" y="455" width="110" height="20" fill="#1E3A5F" />
        <text x="210" y="470" fontSize="10" fill="white" textAnchor="middle">
          2025年6月
        </text>

        <line x1="155" y1="485" x2="265" y2="485" stroke="#334155" strokeWidth="1" />

        <text x="170" y="500" fontSize="8" fill="#94A3B8" textAnchor="middle">
          月
        </text>
        <text x="190" y="500" fontSize="8" fill="#94A3B8" textAnchor="middle">
          火
        </text>
        <text x="210" y="500" fontSize="8" fill="#94A3B8" textAnchor="middle">
          水
        </text>
        <text x="230" y="500" fontSize="8" fill="#94A3B8" textAnchor="middle">
          木
        </text>
        <text x="250" y="500" fontSize="8" fill="#94A3B8" textAnchor="middle">
          金
        </text>

        <line x1="155" y1="505" x2="265" y2="505" stroke="#334155" strokeWidth="1" />

        <text x="170" y="520" fontSize="8" fill="white" textAnchor="middle">
          1
        </text>
        <text x="190" y="520" fontSize="8" fill="white" textAnchor="middle">
          2
        </text>
        <text x="210" y="520" fontSize="8" fill="white" textAnchor="middle">
          3
        </text>
        <text x="230" y="520" fontSize="8" fill="white" textAnchor="middle">
          4
        </text>
        <text x="250" y="520" fontSize="8" fill="white" textAnchor="middle">
          5
        </text>

        <rect x="165" y="525" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.5" />
        <rect x="205" y="525" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.5" />
        <rect x="245" y="525" width="10" height="10" rx="2" fill="#3B82F6" opacity="0.5" />
      </g>

      {/* Certificate */}
      <g className="animate-float">
        <rect x="530" y="450" width="120" height="100" rx="5" fill="#0F2942" />
        <rect x="535" y="455" width="110" height="90" rx="3" fill="#F8FAFC" />

        <path d="M535 475 L645 475 M535 485 L645 485" stroke="#0F2942" strokeWidth="1" />
        <text x="590" y="470" fontSize="10" fill="#0F2942" textAnchor="middle" fontWeight="bold">
          修了証
        </text>

        <text x="590" y="500" fontSize="6" fill="#0F172A" textAnchor="middle">
          このプログラムを
        </text>
        <text x="590" y="510" fontSize="6" fill="#0F172A" textAnchor="middle">
          正常に完了したことを証明します
        </text>

        <text x="590" y="530" fontSize="8" fill="#0F2942" textAnchor="middle" fontWeight="bold">
          2025年6月30日
        </text>

        <circle cx="590" cy="545" r="10" fill="#3B82F6" opacity="0.3" className="animate-pulse" />
        <circle cx="590" cy="545" r="7" fill="#3B82F6" opacity="0.5" className="animate-pulse" />
        <circle cx="590" cy="545" r="4" fill="#3B82F6" opacity="0.7" className="animate-pulse" />
      </g>

      {/* Universal Icons */}
      <g className="animate-float">
        <circle cx="400" cy="450" r="25" fill="#0F2942" className="animate-pulse" />
        <path d="M390 450 L410 450" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M400 440 L400 460" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        <circle cx="460" cy="480" r="25" fill="#1E3A5F" className="animate-pulse" />
        <circle cx="460" cy="480" r="12" fill="none" stroke="white" strokeWidth="2" />
        <path d="M460 468 L460 492" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M448 480 L472 480" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      <g className="animate-float">
        <circle cx="340" cy="480" r="25" fill="#2C4F7C" className="animate-pulse" />
        <path d="M330 470 L350 490" stroke="white" strokeWidth="2" strokeLinecap="round" />
        <path d="M350 470 L330 490" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Glowing Dots */}
      <circle cx="200" cy="150" r="3" fill="white" filter="url(#glow)" />
      <circle cx="600" cy="150" r="3" fill="white" filter="url(#glow)" />
      <circle cx="200" cy="450" r="3" fill="white" filter="url(#glow)" />
      <circle cx="600" cy="450" r="3" fill="white" filter="url(#glow)" />

    </svg>
  );
}
