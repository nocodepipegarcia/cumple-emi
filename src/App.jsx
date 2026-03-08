import React, { useState, useEffect } from 'react';
import { Plane, Heart, MapPin, Sparkles, Star } from 'lucide-react';

// Estilos CSS para la animación 3D del reloj y el fondo rainbow en tonos cálidos
const customStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  @keyframes flipTop {
    0% { transform: rotateX(0deg); }
    100% { transform: rotateX(-90deg); }
  }
  @keyframes flipBottom {
    0% { transform: rotateX(90deg); }
    100% { transform: rotateX(0deg); }
  }
  .animate-flip-top {
    animation: flipTop 0.4s ease-in forwards;
    transform-origin: bottom;
  }
  .animate-flip-bottom {
    animation: flipBottom 0.4s ease-out 0.4s forwards;
    transform-origin: top;
  }
  
  /* Animación de fondo arcoíris pastel (Púrpuras a Rosados/Rojos) */
  @keyframes rainbowBg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .bg-pastel-rainbow {
    background: linear-gradient(-45deg, #e9d5ff, #f3e8ff, #fce7f3, #fbcfe8, #fecdd3, #ffe4e6, #e9d5ff);
    background-size: 300% 300%;
    animation: rainbowBg 15s ease infinite;
  }
`;

// Componente para un solo dígito con animación de caída (Flip)
const FlipCard = ({ char, colorClass, isLarge }) => {
    const [prevChar, setPrevChar] = useState(char);
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        if (char !== prevChar) {
            setAnimating(true);
            const timer = setTimeout(() => {
                setPrevChar(char);
                setAnimating(false);
            }, 800); // Duración total de la animación (0.4s + 0.4s)
            return () => clearTimeout(timer);
        }
    }, [char, prevChar]);

    // Tamaños dinámicos dependiendo de si es "Días" (isLarge) o el resto
    const sizeClasses = isLarge
        ? "w-14 sm:w-20 md:w-28 lg:w-32 h-20 sm:h-28 md:h-36 lg:h-44 text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
        : "w-10 sm:w-14 md:w-16 lg:w-20 h-16 sm:h-20 md:h-24 lg:h-28 text-4xl sm:text-5xl md:text-6xl lg:text-7xl";

    return (
        <div className={`relative inline-flex flex-col items-center justify-center bg-white ${colorClass} font-sans tabular-nums font-bold rounded-xl shadow-[0_4px_10px_rgba(200,100,200,0.08)] border border-purple-50 mx-[2px] ${sizeClasses} perspective-1000`}>

            {/* Mitad Superior - Estática (Fondo blanco opaco para ocultar) */}
            <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-white rounded-t-xl border-b border-purple-50">
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] leading-none">
                    {char}
                </span>
            </div>

            {/* Mitad Inferior - Estática (Fondo completamente opaco para que no se traslape el texto) */}
            <div className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-purple-50 rounded-b-xl border-t border-purple-50 z-0">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] leading-none">
                    {prevChar}
                </span>
            </div>

            {/* Tarjeta Superior que Cae */}
            {animating && (
                <div
                    className="absolute top-0 left-0 w-full h-1/2 overflow-hidden bg-white rounded-t-xl animate-flip-top shadow-[inset_0_-10px_20px_rgba(0,0,0,0.03)] border-b border-purple-50 z-10"
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[50%] leading-none">
                        {prevChar}
                    </span>
                </div>
            )}

            {/* Tarjeta Inferior que Cae */}
            {animating && (
                <div
                    className="absolute bottom-0 left-0 w-full h-1/2 overflow-hidden bg-purple-50 rounded-b-xl animate-flip-bottom shadow-[inset_0_10px_20px_rgba(0,0,0,0.03)] border-t border-purple-50 z-10"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateX(90deg)' }}
                >
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[50%] leading-none">
                        {char}
                    </span>
                </div>
            )}

            {/* Bisagra / Línea central suave */}
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-purple-100 -translate-y-1/2 z-20"></div>
        </div>
    );
};

// Componente para agrupar dígitos
const FlipGroup = ({ value, label, colorClass, isLarge }) => {
    const chars = String(value).split('');

    return (
        <div className="flex flex-col items-center mx-1 sm:mx-3 my-2">
            <div className="flex">
                {chars.map((char, i) => (
                    <FlipCard key={i} char={char} colorClass={colorClass} isLarge={isLarge} />
                ))}
            </div>
            <span className={`mt-3 sm:mt-4 ${colorClass} opacity-90 text-[10px] sm:text-xs md:text-sm font-bold tracking-[0.2em] uppercase font-sans`}>
                {label}
            </span>
        </div>
    );
};

export default function App() {
    const [timeLeft, setTimeLeft] = useState({
        days: '000',
        hours: '00',
        minutes: '00',
        seconds: '00'
    });

    useEffect(() => {
        // Fecha objetivo: 10 de Diciembre de 2026
        const targetDate = new Date('2026-12-10T00:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
                return;
            }

            const d = Math.floor(difference / (1000 * 60 * 60 * 24));
            const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(d).padStart(3, '0'),
                hours: String(h).padStart(2, '0'),
                minutes: String(m).padStart(2, '0'),
                seconds: String(s).padStart(2, '0')
            });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-pastel-rainbow flex flex-col items-center justify-center p-4 font-sans selection:bg-rose-200">
            {/* Inyección de estilos de animación */}
            <style>{customStyles}</style>

            {/* Contenedor principal del tablero */}
            <div className="w-full max-w-5xl bg-white/70 backdrop-blur-md rounded-[2.5rem] p-6 sm:p-10 shadow-[0_20px_50px_rgba(251,113,133,0.15)] border border-white relative overflow-hidden">

                {/* Efecto de destellos sutiles de fondo */}
                <div className="absolute inset-0 opacity-60 pointer-events-none bg-[radial-gradient(circle_at_center,_#ffffff_3px,_transparent_3px)] [background-size:30px_30px]"></div>

                {/* Encabezado del Tablero */}
                <div className="border-b-2 border-purple-100 pb-6 mb-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-br from-purple-200 to-fuchsia-200 p-3 rounded-2xl text-purple-600 shadow-sm border border-white">
                                <Plane size={28} strokeWidth={2.5} className="-rotate-12" />
                            </div>
                            <div>
                                <h1 className="text-purple-600 font-extrabold text-xl sm:text-2xl tracking-widest uppercase flex items-center gap-2">
                                    Próxima Aventura <Sparkles size={18} className="text-fuchsia-400" />
                                </h1>
                                <p className="text-purple-400 font-medium text-sm tracking-wider uppercase mt-1">
                                    Preparando el viaje de Emi
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4 sm:gap-6 text-sm font-bold uppercase tracking-widest">
                            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white shadow-sm">
                                <MapPin size={16} className="text-fuchsia-400" />
                                <span className="text-purple-600">Vuelo 2026</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 px-4 py-2 rounded-full border border-white shadow-sm">
                                <Heart size={16} className="text-rose-400 animate-pulse fill-rose-400" />
                                <span className="text-rose-500">Confirmado</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información del Destino */}
                <div className="flex flex-col items-center mb-8 relative z-10">
                    <p className="text-fuchsia-500 font-bold uppercase tracking-[0.3em] text-sm mb-3 flex items-center gap-2">
                        <Star size={14} className="text-purple-400 fill-purple-400" /> Fecha de Partida <Star size={14} className="text-purple-400 fill-purple-400" />
                    </p>
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                        {"10 DIC 2026".split('').map((char, idx) =>
                            char === ' ' ? (
                                <div key={idx} className="w-2 sm:w-3" />
                            ) : (
                                <span key={idx} className="text-xl sm:text-3xl font-sans font-extrabold text-purple-600 bg-white/80 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl shadow-sm border border-white">
                                    {char}
                                </span>
                            )
                        )}
                    </div>
                </div>

                {/* Área del Contador Reversible (Split Flap) */}
                <div className="flex flex-col items-center gap-6 sm:gap-8 relative z-10 w-full">

                    {/* Fila 1: DÍAS */}
                    <div className="flex justify-center bg-white/40 p-4 sm:p-8 rounded-[2rem] border border-white shadow-sm w-full max-w-2xl">
                        <FlipGroup value={timeLeft.days} label="Días Faltantes" colorClass="text-purple-600" isLarge={true} />
                    </div>

                    {/* Fila 2: HORAS, MINUTOS, SEGUNDOS */}
                    <div className="flex flex-wrap justify-center items-end bg-white/40 p-4 sm:p-6 rounded-[2rem] border border-white shadow-sm w-full gap-2 sm:gap-6">

                        <FlipGroup value={timeLeft.hours} label="Horas" colorClass="text-fuchsia-500" isLarge={false} />

                        <div className="hidden sm:flex flex-col items-center justify-center pb-8 sm:pb-10 px-1">
                            <div className="w-2 h-2 rounded-full bg-purple-300 mb-2"></div>
                            <div className="w-2 h-2 rounded-full bg-purple-300 mt-2"></div>
                        </div>

                        <FlipGroup value={timeLeft.minutes} label="Minutos" colorClass="text-pink-500" isLarge={false} />

                        <div className="hidden sm:flex flex-col items-center justify-center pb-8 sm:pb-10 px-1">
                            <div className="w-2 h-2 rounded-full bg-pink-300 mb-2"></div>
                            <div className="w-2 h-2 rounded-full bg-pink-300 mt-2"></div>
                        </div>

                        <FlipGroup value={timeLeft.seconds} label="Segundos" colorClass="text-rose-400" isLarge={false} />

                    </div>

                </div>

                {/* Pie de página del tablero */}
                <div className="mt-10 pt-6 border-t border-purple-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-purple-500 text-xs font-bold uppercase tracking-widest relative z-10">
                    <span className="bg-white/50 px-4 py-2 rounded-full shadow-sm">Destino Esperando...</span>
                    <span className="bg-white/50 px-4 py-2 rounded-full shadow-sm">Maletas casi listas</span>
                </div>

            </div>
        </div>
    );
}