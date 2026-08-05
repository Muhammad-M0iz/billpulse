import React, { useState, useRef } from "react";

interface AnimatedPayButtonProps {
  monthlyFee: number | string;
  onConfirm: () => Promise<void>;
  disabled?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  rotation: number;
  vRot: number;
}

export const AnimatedPayButton: React.FC<AnimatedPayButtonProps> = ({
  monthlyFee,
  onConfirm,
  disabled = false,
}) => {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Canvas particle burst animation
  const triggerParticleBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth || 300);
    const height = (canvas.height = canvas.offsetHeight || 100);

    const centerX = width / 2;
    const centerY = height / 2;

    const colors = ["#34d399", "#10b981", "#6ee7b7", "#a7f3d0", "#ffffff"];
    const particles: Particle[] = [];

    for (let i = 0; i < 35; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 6;
      particles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5,
        size: 3 + Math.random() * 5,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }

    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15; // gravity
        p.alpha -= 0.025;
        p.rotation += p.vRot;

        if (p.alpha > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);

          // Draw emerald crystal polygon
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.7, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.7, 0);
          ctx.closePath();
          ctx.fill();

          ctx.restore();
        }
      });

      if (alive && elapsed < 1.2) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleClick = async () => {
    if (status !== "idle" || disabled) return;

    // 1. Trigger particles burst
    triggerParticleBurst();

    // 2. Expand into loading state
    setStatus("loading");

    try {
      // Execute subscription API call
      await onConfirm();

      // 3. Convert loader into green tick
      setStatus("success");
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div ref={containerRef} className="relative w-full flex justify-end">
      {/* Particle Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute -top-12 -bottom-12 -left-16 -right-16 pointer-events-none z-30"
      />

      {status === "idle" && (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className="relative z-10 px-7 py-3 bg-emerald-400 hover:bg-emerald-300 text-[#0b0f19] text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.4)] hover:shadow-[0_0_35px_rgba(52,211,153,0.8)] cursor-pointer group rounded-none"
        >
          <span className="material-symbols-outlined text-base transition-transform group-hover:scale-110">
            credit_card
          </span>
          <span>Confirm &amp; Pay ${monthlyFee}</span>
        </button>
      )}

      {status === "loading" && (
        <div className="w-full bg-[#181b25] border border-emerald-400/80 text-emerald-400 py-3 px-6 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(52,211,153,0.3)] transition-all duration-500 animate-pulse">
          <span className="material-symbols-outlined animate-spin text-base">sync</span>
          <span>Processing Subscription...</span>
        </div>
      )}

      {status === "success" && (
        <div className="w-full bg-emerald-500/10 border border-emerald-400 text-emerald-400 py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(52,211,153,0.4)] transition-all duration-500 animate-in zoom-in-95">
          <span className="material-symbols-outlined text-lg animate-bounce">check_circle</span>
          <span>Plan Subscribed Successfully!</span>
        </div>
      )}
    </div>
  );
};
