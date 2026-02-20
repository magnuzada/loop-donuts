"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ParallaxComet() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // --- MOVIMENTO DO DONUT (Mantido Perfeito) ---
  const donutX = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  const donutY = useTransform(scrollYProgress, [0, 1], ["400px", "-600px"]);
  const donutRotate = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // --- MOVIMENTOS DOS GRANULADOS (Parallax) ---
  const ySlow = useTransform(scrollYProgress, [0, 1], ["100px", "-200px"]);
  const rotateSlow = useTransform(scrollYProgress, [0, 1], [0, 180]);

  const yMedium = useTransform(scrollYProgress, [0, 1], ["300px", "-500px"]);
  const rotateMedium = useTransform(scrollYProgress, [0, 1], [0, -90]);

  const yFast = useTransform(scrollYProgress, [0, 1], ["500px", "-800px"]);
  const rotateFast = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full min-h-[120vh] flex items-center justify-center overflow-hidden z-10 pointer-events-none"
    >
      
      {/* --- CAMADA 1: GRANULADOS DE FUNDO --- */}
      <motion.div style={{ y: ySlow, rotate: rotateSlow }} className="absolute inset-0 w-full h-full">
        <div className="absolute top-[10%] left-[10%] w-6 h-12 bg-blue-400 rounded-full opacity-60" />
        <div className="absolute top-[20%] right-[15%] w-4 h-8 bg-pink-400 rounded-full opacity-60 rotate-45" />
        <div className="absolute bottom-[30%] left-[20%] w-5 h-10 bg-cta rounded-full opacity-60 -rotate-12" />
        <div className="absolute top-[5%] left-[50%] w-4 h-8 bg-green-400 rounded-full opacity-60 rotate-90" />
      </motion.div>

      {/* --- O DONUT COLOSSAL --- */}
      <motion.div
        style={{ x: donutX, y: donutY, rotate: donutRotate, opacity }}
        /* AJUSTE DE TAMANHO: 
           - Mobile: w-[550px] h-[550px] (Aumentado para mais destaque no celular)
           - Desktop (md): w-[850px] h-[850px] (Mantido colossal no computador)
        */
        className="relative w-[550px] h-[550px] md:w-[850px] md:h-[850px] z-20"
      >
        <img 
          src="/comet-donut.png"
          alt="Giant Comet Donut"
          className="relative z-20 w-full h-full object-contain drop-shadow-2xl"
        />
        {/* Rastro de velocidade */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[110%] h-[110%] bg-gradient-to-tl from-cta/30 to-transparent blur-3xl rounded-full"></div>
      </motion.div>

      {/* --- CAMADA 2: GRANULADOS MÉDIOS --- */}
      <motion.div style={{ y: yMedium, rotate: rotateMedium }} className="absolute inset-0 w-full h-full z-20">
        <div className="absolute top-[40%] left-[15%] w-8 h-16 bg-brand rounded-full shadow-lg -rotate-45" />
        <div className="absolute top-[30%] right-[25%] w-6 h-12 bg-cta rounded-full shadow-lg rotate-12" />
        <div className="absolute bottom-[20%] right-[10%] w-8 h-16 bg-blue-500 rounded-full shadow-lg rotate-90" />
      </motion.div>

      {/* --- CAMADA 3: GRANULADOS FRONT --- */}
      <motion.div style={{ y: yFast, rotate: rotateFast }} className="absolute inset-0 w-full h-full z-30">
        <div className="absolute top-[60%] left-[5%] w-10 h-20 bg-pink-500 rounded-full shadow-xl rotate-12 blur-[1px]" />
        <div className="absolute bottom-[10%] left-[40%] w-12 h-24 bg-cta rounded-full shadow-xl -rotate-12 blur-[2px]" />
        <div className="absolute top-[20%] right-[5%] w-10 h-20 bg-brand rounded-full shadow-xl rotate-45 blur-[1px]" />
      </motion.div>

    </section>
  );
}