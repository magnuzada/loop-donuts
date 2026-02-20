"use client";

import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface LoopSliderProps {
  children: React.ReactNode;
  baseVelocity?: number; // Velocidade do giro automático
}

export function LoopSlider({ children, baseVelocity = -0.5 }: LoopSliderProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);

  // Calcula a largura do conteúdo para saber quando resetar o loop
  useEffect(() => {
    if (contentRef.current) {
      setContainerWidth(contentRef.current.scrollWidth / 2);
    }
  }, [children]);

  // Animação de Giro Infinito
  useAnimationFrame((t, delta) => {
    let moveBy = baseVelocity * (delta / 10);
    baseX.set(baseX.get() + moveBy);

    // Reinicia a posição para criar o efeito infinito
    if (baseX.get() <= -containerWidth) {
      baseX.set(0);
    } else if (baseX.get() > 0) {
      baseX.set(-containerWidth);
    }
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex cursor-grab active:cursor-grabbing">
      <motion.div 
        className="flex gap-8" 
        style={{ x: baseX }}
        drag="x"
        // Permite o "drag" e atualiza a posição base para não dar salto
        onDrag={(e, info) => {
            baseX.set(baseX.get() + info.delta.x);
        }}
        ref={contentRef}
      >
        {/* Renderiza o conteúdo duas vezes para o loop ser invisível */}
        {children}
        {children}
      </motion.div>
    </div>
  );
}