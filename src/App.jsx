import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MapPin, Sparkles, Star, PartyPopper, Calendar, Clock } from 'lucide-react';

// Fechas fijas en UTC para evitar diferencias por zona horaria
const TARGET_DATE = Date.UTC(2026, 11, 10); // 10 de Diciembre de 2026
const START_DATE  = Date.UTC(2026,  0,  1); // 1 de Enero de 2026 (referencia de progreso)

// Componente para un bloque de countdown
const CountdownBlock = ({ value, label, accent }) => {
    return (
        <div className="countdown-box flex flex-col items-center px-5 py-5 sm:px-8 sm:py-7 min-w-[90px] sm:min-w-[120px]">
            <span
                key={value}
                className="number-animate number-glow font-extrabold text-5xl sm:text-6xl md:text-7xl tracking-tight font-['Outfit']"
                style={{ color: accent }}
            >
                {value}
            </span>
            <span className="mt-3 text-purple-300/70 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase">
                {label}
            </span>
        </div>
    );
};

// Partículas decorativas flotantes
const Particles = () => {
    const particles = [
        { top: '10%', left: '15%', duration: '7s', delay: '0s' },
        { top: '20%', right: '20%', duration: '5s', delay: '1s' },
        { top: '60%', left: '10%', duration: '8s', delay: '2s' },
        { top: '75%', right: '15%', duration: '6s', delay: '0.5s' },
        { top: '40%', left: '80%', duration: '9s', delay: '3s' },
        { top: '85%', left: '50%', duration: '6s', delay: '1.5s' },
        { top: '30%', left: '40%', duration: '7s', delay: '2.5s' },
        { top: '50%', right: '30%', duration: '5.5s', delay: '0.8s' },
    ];

    return (
        <>
            {particles.map((p, i) => (
                <div
                    key={i}
                    className="particle"
                    style={{
                        top: p.top,
                        left: p.left,
                        right: p.right,
                        '--duration': p.duration,
                        '--delay': p.delay,
                    }}
                />
            ))}
        </>
    );
};

// Barra de progreso
const ProgressBar = ({ progress }) => {
    const pct = Math.min(Math.max(progress, 0), 100);
    return (
        <div className="w-full mt-8 sm:mt-10">
            <div className="flex justify-between items-center mb-2">
                <span className="text-purple-300/50 text-[10px] font-semibold tracking-[0.2em] uppercase">Ene 2026</span>
                <span className="text-purple-300/50 text-[10px] font-semibold tracking-[0.2em] uppercase">
                    {Math.round(pct)}% del camino
                </span>
                <span className="text-purple-300/50 text-[10px] font-semibold tracking-[0.2em] uppercase">Dic 2026</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div
                    className="h-full rounded-full progress-bar-fill transition-[width] duration-1000 ease-linear"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

export default function App() {
    const [timeLeft, setTimeLeft] = useState({
        days: '000',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });
    const [finished, setFinished] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    const updateCountdown = useCallback(() => {
        const now = Date.now();
        const difference = TARGET_DATE - now;

        // Progreso de START_DATE hacia TARGET_DATE
        const total = TARGET_DATE - START_DATE;
        const elapsed = now - START_DATE;
        setProgress((elapsed / total) * 100);

        if (difference <= 0) {
            setTimeLeft({ days: '000', hours: '00', minutes: '00', seconds: '00' });
            setFinished(true);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
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
            seconds: String(s).padStart(2, '0'),
        });
    }, []);

    useEffect(() => {
        updateCountdown();
        intervalRef.current = setInterval(updateCountdown, 1000);
        return () => clearInterval(intervalRef.current);
    }, [updateCountdown]);

    return (
        <div className="bg-dreamy flex flex-col items-center justify-center p-4 sm:p-6 min-h-screen font-['Outfit']">
            <Particles />

            {/* Contenedor principal */}
            <div className="glass-card w-full max-w-3xl p-6 sm:p-10 md:p-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col items-center mb-8 sm:mb-10">
                    <div className="flex items-center gap-3 mb-3">
                        <Sparkles size={20} className="text-purple-400" />
                        <h1 className="text-gradient-purple text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-wide">
                            Próxima Aventura
                        </h1>
                        <Sparkles size={20} className="text-pink-400" />
                    </div>
                    <p className="text-purple-300/60 font-medium text-sm tracking-wider">
                        Preparando el viaje de Emi
                    </p>
                </div>

                {/* Fecha */}
                <div className="flex flex-col items-center mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Calendar size={14} className="text-purple-400/60" />
                        <span className="text-purple-300/50 text-xs font-semibold tracking-[0.2em] uppercase">
                            Fecha de Partida
                        </span>
                    </div>
                    <div className="date-badge text-lg sm:text-xl tracking-widest">
                        10 · DIC · 2026
                    </div>
                </div>

                {/* Badges */}
                <div className="flex justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <MapPin size={14} className="text-purple-400/70" />
                        <span className="text-purple-200/70 text-xs sm:text-sm font-semibold tracking-wider">Vuelo 2026</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Heart size={14} className="text-pink-400 animate-soft-pulse" />
                        <span className="text-pink-200/70 text-xs sm:text-sm font-semibold tracking-wider">Confirmado</span>
                    </div>
                </div>

                {/* Countdown principal */}
                <div className="flex flex-col items-center gap-6 sm:gap-8">

                    {/* Días — prominente */}
                    <div className="countdown-box flex flex-col items-center px-8 py-6 sm:px-14 sm:py-8 w-full max-w-md">
                        <span
                            key={timeLeft.days}
                            className="number-animate number-glow text-gradient-purple font-extrabold text-7xl sm:text-8xl md:text-9xl tracking-tight font-['Outfit']"
                        >
                            {timeLeft.days}
                        </span>
                        <span className="mt-4 text-purple-300/60 text-xs sm:text-sm font-bold tracking-[0.25em] uppercase">
                            Días Faltantes
                        </span>
                    </div>

                    {/* Horas, Minutos, Segundos */}
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4">
                        <CountdownBlock value={timeLeft.hours} label="Horas" accent="#c084fc" />

                        <div className="flex flex-col items-center gap-2 pb-6">
                            <div className="separator-dot"></div>
                            <div className="separator-dot"></div>
                        </div>

                        <CountdownBlock value={timeLeft.minutes} label="Minutos" accent="#e879f9" />

                        <div className="flex flex-col items-center gap-2 pb-6">
                            <div className="separator-dot"></div>
                            <div className="separator-dot"></div>
                        </div>

                        <CountdownBlock value={timeLeft.seconds} label="Segundos" accent="#f472b6" />
                    </div>
                </div>

                {/* Barra de progreso */}
                <ProgressBar progress={progress} />

                {/* Mensaje cuando el countdown termina */}
                {finished && (
                    <div className="flex flex-col items-center gap-4 mt-10 animate-celebration">
                        <PartyPopper size={48} className="text-fuchsia-400" />
                        <p className="text-gradient-purple text-2xl sm:text-3xl font-extrabold tracking-wide text-center">
                            ¡Es hora de partir, Emi!
                        </p>
                        <p className="text-purple-300/60 font-medium text-sm tracking-wider">
                            La aventura comienza ahora
                        </p>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold uppercase tracking-widest text-purple-300/40">
                    <span className="flex items-center gap-2">
                        <Clock size={12} />
                        Destino Esperando...
                    </span>
                    <span className="flex items-center gap-2">
                        <Star size={12} className="fill-current" />
                        Maletas casi listas
                    </span>
                </div>
            </div>
        </div>
    );
}
