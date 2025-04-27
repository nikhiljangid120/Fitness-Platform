import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    // Full screen overlay with backdrop blur
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div className="flex flex-col items-center">

        {/* Logo & Spinner Container - Larger Size */}
        <div className="relative h-24 w-24 mb-6">

          {/* 1. Outer Soft Pulsing Glow (Subtle Depth) */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary via-secondary to-primary/60 opacity-75 animate-pulse blur-lg"></div>

          {/* 2. Rotating Gradient Border (Main Visual) */}
          {/* Using animate-spin with a longer duration for a smoother rotation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-spin [animation-duration:3s]"></div>

          {/* 3. Inner Background (Creates the cutout) */}
          <div className="absolute inset-2 rounded-full bg-background"></div>

           {/* 4. Faster Spinning Icon (Overlaying the border cutout) */}
           {/* Placed slightly outside the main border (inset-1) to spin clearly */}
           <Loader2 className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] animate-spin text-primary/80 [animation-duration:1.5s]" />


          {/* 5. Central Logo Letter */}
          <div className="absolute inset-2 flex items-center justify-center rounded-full">
             {/* Increased size and perhaps a slightly different gradient for the text */}
            <span className="text-4xl font-bold bg-gradient-to-br from-primary via-secondary to-accent bg-clip-text text-transparent">
              N
            </span>
          </div>

        </div>

        {/* Loading Indicator Text / Dots */}
        <div className="flex flex-col items-center">
           <p className="mb-3 text-lg font-medium text-foreground/90">
             Loading FlexForge
           </p>
           <div className="flex space-x-2">
              {/* Animated bouncing dots */}
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce"></span>
           </div>
        </div>

      </div>
    </div>
  );
}

// Optional: Ensure you have 'accent' color defined in your tailwind.config.js
// if you use it in the gradient-text like above.
// Also ensure your primary/secondary/background colors are set up.

// Add bounce animation keyframes to tailwind.config.js if not already present
// (Tailwind typically includes this by default)
/* Example in tailwind.config.js (if needed):
theme: {
  extend: {
    keyframes: {
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8,0,1,1)',
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0,0,0.2,1)',
        },
      }
    },
    animation: {
       bounce: 'bounce 1s infinite',
    }
  }
}
*/