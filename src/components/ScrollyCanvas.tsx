'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 90; // frames from 000 to 089

export default function ScrollyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    // Preload all images properly
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const handleImageLoad = () => {
      loadedCount++;
      setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
      if (loadedCount === FRAME_COUNT) {
        setIsReady(true);
      }
    };

    for (let index = 0; index < FRAME_COUNT; index++) {
      const filename = `/sequence/frame_${index.toString().padStart(3, '0')}.png`;
      const img = new window.Image();
      img.src = filename;
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad; // Continue even if one fails
      loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, []);

  useEffect(() => {
    // Draw initial frame once all images are ready
    if (isReady && images.length > 0 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = images[0];
      
      const drawImage = () => {
        const hRatio = canvas.width / img.width;
        const vRatio = canvas.height / img.height;
        const ratio = Math.max(hRatio, vRatio);
        const centerShift_x = (canvas.width - img.width * ratio) / 2;
        const centerShift_y = (canvas.height - img.height * ratio) / 2;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
           centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);  
      };

      if (img.complete && img.naturalWidth > 0) {
        drawImage();
      }
    }
  }, [isReady, images]);

  useMotionValueEvent(frameIndex, 'change', (latest) => {
    if (!canvasRef.current || images.length === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentImg = images[Math.floor(latest)];
    if (!currentImg) return;

    // Use object-fit cover logic for drawing to canvas
    const hRatio = canvas.width / currentImg.width;
    const vRatio = canvas.height / currentImg.height;
    const ratio = Math.max(hRatio, vRatio); // Max for cover, Min for contain
    const centerShift_x = (canvas.width - currentImg.width * ratio) / 2;
    const centerShift_y = (canvas.height - currentImg.height * ratio) / 2;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentImg, 0, 0, currentImg.width, currentImg.height,
       centerShift_x, centerShift_y, currentImg.width * ratio, currentImg.height * ratio);  
  });

  useEffect(() => {
    // Handle resizing to keep canvas dimensions matched to window
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      // Need to redraw current frame on resize
      if (images.length > 0) {
        const ctx = canvas.getContext('2d');
        const currentImg = images[Math.floor(frameIndex.get())];
        if (ctx && currentImg) {
          const hRatio = canvas.width / currentImg.width;
          const vRatio = canvas.height / currentImg.height;
          const ratio = Math.max(hRatio, vRatio);
          const centerShift_x = (canvas.width - currentImg.width * ratio) / 2;
          const centerShift_y = (canvas.height - currentImg.height * ratio) / 2;
          
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(currentImg, 0, 0, currentImg.width, currentImg.height,
             centerShift_x, centerShift_y, currentImg.width * ratio, currentImg.height * ratio);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-[500vh]">
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden bg-[#121212] p-4 sm:p-6 md:p-8 lg:p-12">
        
        {/* Loading Overlay */}
        {!isReady && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#121212]">
            <div className="text-center">
              <div className="text-white text-xl font-light mb-4 tracking-widest uppercase">Loading Sequence</div>
              <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="text-white/40 text-sm mt-2 font-mono">{loadingProgress}%</div>
            </div>
          </div>
        )}

        {/* Outer futuristic cyberpunk container */}
        <div className="relative w-full h-full p-[2px] rounded-xl overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.2)] flex flex-col group">
          
          {/* Animated revolving light streaks using vmax to ensure perfect circle on any aspect ratio */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vmax] h-[200vmax] z-0 bg-[conic-gradient(from_0deg_at_50%_50%,#00000000_0%,#00000000_40%,#06b6d4_50%,#00000000_60%,#00000000_90%,#8b5cf6_100%)] animate-[spin_6s_linear_infinite] opacity-70 group-hover:opacity-100 transition-opacity duration-700"></div>

          {/* Internal content wrapper with glassmorphism */}
          <div className="relative z-10 flex flex-col w-full h-full bg-[#050510]/80 backdrop-blur-2xl rounded-[10px] border border-white/10 overflow-hidden p-2 sm:p-4">
            
            {/* Soft inner blur glow */}
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(6,182,212,0.1),inset_0_0_30px_rgba(139,92,246,0.1)] z-20 pointer-events-none rounded-[8px]"></div>

            {/* Top UI Accents */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#06b6d4]/50 to-transparent z-30"></div>
            <div className="absolute top-2 right-4 flex gap-1 z-30 opacity-30">
              <div className="w-6 h-1 bg-[#06b6d4] rounded-full"></div>
              <div className="w-1 h-1 bg-[#8b5cf6] rounded-full"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>

            {/* Inner Canvas Area */}
            <div className="relative flex-grow h-full w-full z-10">
              <div className="w-full h-full overflow-hidden rounded-[6px] bg-[#010101] border border-white/5 shadow-[0_0_20px_rgba(6,182,212,0.1)_inset,0_0_15px_rgba(0,0,0,0.8)]">
                <canvas 
                  ref={canvasRef} 
                  className="w-full h-full block mix-blend-screen" 
                />
              </div>
            </div>
            
            {/* Bottom UI Accents */}
            <div className="absolute bottom-2 left-4 text-[9px] font-mono tracking-widest text-[#06b6d4]/50 z-30">SYS.ON // READY</div>
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-[#8b5cf6]/30 via-transparent to-transparent z-30"></div>

          </div>
        </div>

      </div>
    </div>
  );
}
