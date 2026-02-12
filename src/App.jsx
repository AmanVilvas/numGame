import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const generateLevelNumber = (length) => {
    let numStr = "";
    for (let i = 0; i < length; i++) {
        const digit = i === 0 ? Math.floor(Math.random() * 9) + 1 : Math.floor(Math.random() * 10);
        numStr += digit;
    }
    return numStr;
};

const PREMIUM_EASE = [0.22, 1, 0.36, 1];

const TimerBar = ({ duration, isRunning }) => (
    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-6 md:mt-8">
        <motion.div
            initial={{ width: "100%" }}
            animate={isRunning ? { width: "0%" } : { width: "100%" }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-orange-400 shadow-[0_0_15px_rgba(255,106,0,0.6)]"
        />
    </div>
);

const ResultScreen = ({ level, correctNumber, userGuess, onRestart, onContinue }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ ease: PREMIUM_EASE, duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-6 md:space-y-8 p-4 md:p-6 max-w-md w-full mx-4"
    >
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/40 flex items-center justify-center"
        >
            <svg className="w-8 h-8 md:w-10 md:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </motion.div>

        <div className="space-y-1 md:space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Incorrect!</h2>
            <p className="text-slate-400 text-xs md:text-sm font-medium">
                You reached Level {level}
            </p>
        </div>

        <div className="w-full space-y-2 md:space-y-3">
            <div className="flex justify-between items-center p-3 md:p-4 rounded-xl glass-effect border border-white/10">
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-slate-400 font-semibold">Correct Number</span>
                <span className="text-xl md:text-2xl font-mono font-bold text-emerald-400 tracking-wider">{correctNumber}</span>
            </div>

            <div className="flex justify-between items-center p-3 md:p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                <span className="text-[10px] md:text-xs uppercase tracking-wider text-red-400 font-semibold">Your Answer</span>
                <span className="text-xl md:text-2xl font-mono font-bold text-red-300 tracking-wider">
                    {userGuess || "----"}
                </span>
            </div>
        </div>

        <div className="w-full space-y-2 md:space-y-3 pt-2">
            <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={onContinue}
                className="w-full py-3 md:py-4 text-sm md:text-base bg-gradient-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl shadow-[0_8px_20px_rgba(255,106,0,0.3)] hover:shadow-[0_12px_30px_rgba(255,106,0,0.4)] transition-all"
            >
                Continue from Level {level}
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRestart}
                className="w-full py-3 md:py-4 text-sm md:text-base glass-effect border border-white/10 text-white/80 font-semibold rounded-xl hover:bg-white/5 transition-all"
            >
                Start from Level 1
            </motion.button>
        </div>
    </motion.div>
);

const SuccessIndicator = () => (
    <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        exit={{ scale: 0, rotate: 180 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="absolute -right-2 md:-right-3 -top-2 md:-top-3 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.5)] z-30"
    >
        <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    </motion.div>
);

export default function App() {
    const [gameState, setGameState] = useState('ready');
    const [level, setLevel] = useState(1);
    const [targetNumber, setTargetNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [lastUserGuess, setLastUserGuess] = useState('');

    const inputRef = useRef(null);

    const startRound = useCallback(() => {
        const numDigits = level;
        const newNumber = generateLevelNumber(numDigits);
        setTargetNumber(newNumber);
        setUserInput('');
        setGameState('showing');

        const displayTime = 2000 + (numDigits * 400);

        setTimeout(() => {
            setGameState('input');
        }, displayTime);
    }, [level]);

    const handleSubmit = (e) => {
        if (e) e.preventDefault();
        if (gameState !== 'input') return;

        setLastUserGuess(userInput);

        if (userInput === targetNumber) {
            setGameState('correct');
            setTimeout(() => {
                setLevel(prev => prev + 1);
                setGameState('ready');
            }, 2000);
        } else {
            setGameState('wrong');
        }
    };

    const resetGame = () => {
        setLevel(1);
        setTargetNumber('');
        setUserInput('');
        setLastUserGuess('');
        setGameState('ready');
    };

    const continueFromCurrentLevel = () => {
        setUserInput('');
        setLastUserGuess('');
        setGameState('ready');
    };

    useEffect(() => {
        if (gameState === 'input' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gameState]);

    return (
        <div className="min-h-screen bg-black text-slate-100 flex flex-col items-center justify-center p-4 md:p-6 font-sans selection:bg-orange-500/30 overflow-hidden relative">

            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,106,0,0.08)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,106,0,0.05)_0%,transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <AnimatePresence mode="wait">
                {gameState === 'ready' && (
                    <motion.div
                        key="ready"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: PREMIUM_EASE, duration: 0.6 }}
                        className="z-10 flex flex-col items-center text-center space-y-8 md:space-y-10 max-w-lg px-4"
                    >
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="space-y-4 md:space-y-6"
                        >
                            <div className="w-auto px-6 py-3 md:px-8 md:py-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/30 flex items-center justify-center mx-auto backdrop-blur-xl">
                                <span className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 tracking-wider">
                                    RATHISHRAVI
                                </span>
                            </div>

                            <div>
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white mb-2 md:mb-3">
                                    Cognitive <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400">Memory</span>
                                </h1>
                                <p className="text-slate-400 text-sm md:text-base max-w-sm mx-auto font-medium leading-relaxed px-4">
                                    Test your visual memory and number retention skills across progressive difficulty levels.
                                </p>
                            </div>
                        </motion.div>

                        <div className="space-y-2 md:space-y-3 w-full max-w-xs">
                            <motion.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={startRound}
                                className="w-full px-8 md:px-10 py-3 md:py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold text-xs md:text-sm tracking-wide rounded-xl shadow-[0_10px_30px_rgba(255,106,0,0.4)] hover:shadow-[0_15px_40px_rgba(255,106,0,0.5)] transition-all"
                            >
                                {level > 1 ? `CONTINUE - LEVEL ${level}` : "START SESSION"}
                            </motion.button>

                            {level > 1 && (
                                <motion.button
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={resetGame}
                                    className="w-full px-8 md:px-10 py-2.5 md:py-3 glass-effect border border-white/10 text-white/70 font-semibold text-xs md:text-sm rounded-xl hover:bg-white/5 transition-all"
                                >
                                    Restart from Level 1
                                </motion.button>
                            )}
                        </div>
                    </motion.div>
                )}

                {(gameState === 'showing' || gameState === 'input' || gameState === 'correct') && (
                    <motion.div
                        key="game-card"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: PREMIUM_EASE, duration: 0.6 }}
                        className="z-10 w-full max-w-2xl relative px-4"
                    >
                        <div className="absolute h-32 w-2/3 bottom-[-30px] left-1/2 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(255,106,0,0.15),transparent_70%)] blur-3xl pointer-events-none" />

                        <div className={`
              relative p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl md:rounded-3xl border overflow-hidden
              transition-all duration-500 glass-effect
              ${gameState === 'correct'
                                ? 'border-emerald-500/50 shadow-[0_0_60px_rgba(16,185,129,0.2)]'
                                : 'border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]'
                            }
            `}>
                            <div className="game-stage">
                                <AnimatePresence mode="wait">
                                    {gameState === 'showing' && (
                                        <motion.div
                                            key="display"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, filter: 'blur(20px)', scale: 1.1 }}
                                            transition={{ ease: PREMIUM_EASE, duration: 0.4 }}
                                            className="state-layer"
                                        >
                                            <div className="flex flex-col items-center gap-4 md:gap-6">
                                                <div className="text-lg md:text-xl font-semibold text-white/90 tracking-tight">
                                                    Level {level}
                                                </div>

                                                <div className="flex flex-col items-center w-full">
                                                    <motion.div
                                                        animate={{ scale: [1, 1.02, 1] }}
                                                        transition={{ duration: 2, repeat: Infinity }}
                                                        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight text-center text-shadow-glow"
                                                    >
                                                        {targetNumber}
                                                    </motion.div>
                                                    <TimerBar
                                                        duration={2000 + (targetNumber.length * 400)}
                                                        isRunning={true}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}

                                    {(gameState === 'input' || gameState === 'correct') && (
                                        <motion.div
                                            key="input"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ ease: PREMIUM_EASE, duration: 0.5 }}
                                            className="state-layer"
                                        >
                                            <form
                                                onSubmit={handleSubmit}
                                                className="flex flex-col items-center gap-4 md:gap-6"
                                            >
                                                <div className="text-lg md:text-xl font-semibold text-white/90 tracking-tight">
                                                    Level {level}
                                                </div>

                                                <div className="text-center">
                                                    <h3 className="text-slate-400 text-xs md:text-sm font-bold uppercase tracking-[0.2em] md:tracking-[0.25em]">
                                                        Enter the Number
                                                    </h3>
                                                </div>

                                                <div className="w-full max-w-md relative">
                                                    <input
                                                        ref={inputRef}
                                                        type="text"
                                                        pattern="\d*"
                                                        inputMode="numeric"
                                                        value={userInput}
                                                        onChange={(e) => setUserInput(e.target.value.replace(/\D/g, ''))}
                                                        disabled={gameState === 'correct'}
                                                        className={`
                          w-full bg-white/5 border-2 text-3xl sm:text-4xl md:text-5xl font-bold text-center py-4 md:py-6 px-3 md:px-4 outline-none transition-all rounded-xl md:rounded-2xl
                          ${gameState === 'correct'
                                                                ? 'border-emerald-500/60 text-emerald-400 bg-emerald-500/5'
                                                                : 'border-white/20 text-white focus:border-orange-500/60 focus:bg-white/10'
                                                            }
                        `}
                                                        placeholder="?"
                                                        autoFocus
                                                    />
                                                    <AnimatePresence>
                                                        {gameState === 'correct' && <SuccessIndicator />}
                                                    </AnimatePresence>
                                                </div>

                                                {gameState === 'input' && (
                                                    <motion.button
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        type="submit"
                                                        disabled={!userInput}
                                                        whileHover={userInput ? { scale: 1.03, y: -2 } : {}}
                                                        whileTap={userInput ? { scale: 0.97 } : {}}
                                                        className={`
                          px-10 md:px-12 py-3 md:py-4 rounded-xl font-bold text-xs md:text-sm tracking-wide transition-all
                          ${!userInput
                                                                ? 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
                                                                : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-[0_8px_20px_rgba(255,106,0,0.3)] hover:shadow-[0_12px_30px_rgba(255,106,0,0.4)]'
                                                            }
                        `}
                                                    >
                                                        SUBMIT
                                                    </motion.button>
                                                )}
                                            </form>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}

                {gameState === 'wrong' && (
                    <ResultScreen
                        key="wrong"
                        level={level}
                        correctNumber={targetNumber}
                        userGuess={lastUserGuess}
                        onRestart={resetGame}
                        onContinue={continueFromCurrentLevel}
                    />
                )}
            </AnimatePresence>

            <footer className="fixed bottom-4 md:bottom-6 text-slate-600 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] flex items-center gap-3 md:gap-4 pointer-events-none">
                <span>RATHISHRAVI</span>
                
                
            </footer>
        </div>
    );
}
