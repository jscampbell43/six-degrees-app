'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Client component that displays the degrees of separation path with GSAP animations
// Animates elements appearing sequentially with a "coming from behind" effect
interface ResultsDisplayProps {
  neo4jPath: any;
}

export default function ResultsDisplay({ neo4jPath }: ResultsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && neo4jPath?.segments) {
      // Get DOM elements for animation targeting
      const firstElement = containerRef.current.querySelector('.first-segment');
      const arrows = containerRef.current.querySelectorAll('.arrow-segment');
      const segments = containerRef.current.querySelectorAll('.content-segment');

      // Set base z-index for stacking elements (higher = on top)
      let zIndexSet = 100
      
      // Check if we're in mobile view (screen width < 640px)
      const isMobile = window.innerWidth < 640;
      
      // Animate first element - appears first with a pop effect
      if (firstElement) {
        gsap.fromTo(firstElement,
          {scale: 0.8, y: -20, zIndex: zIndexSet},
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.6, 
            ease: "back.out(1.7)"
          }
        );
      }

      // Set up z-index for all segments so they appear behind previous segment
      const allElements = [...Array.from(segments)];
      allElements.forEach((el, index) => {
        gsap.set(el, { zIndex: zIndexSet - index - 10 });
      });

      // Animate arrows - responsive direction based on screen size
      if (isMobile) {
        // Mobile: animate from top (vertical layout)
        gsap.fromTo(arrows,
          { opacity: 0, y: -50},
          { 
            zIndex: -10,
            opacity: 1, 
            y: 0,
            duration: .5, 
            stagger: .5,
            ease: "power1.out"
          }
        );
      } else {
        // Desktop: animate from left (horizontal layout)
        gsap.fromTo(arrows,
          { opacity: 0, x: -100},
          { 
            zIndex: -10,
            opacity: 1, 
            x: 0,
            duration: .5, 
            stagger: .5,
            ease: "power1.out"
          }
        );
      }

      // Animate segments - responsive direction based on screen size
      if (isMobile) {
        // Mobile: animate from top (vertical layout)
        gsap.fromTo(segments,
          { opacity: 0, y: -50},
          { 
            opacity: 1, 
            y: 0,
            duration: .5, 
            stagger: .5,
            ease: "power1.out"
          }
        );
      } else {
        // Desktop: animate from left (horizontal layout)
        gsap.fromTo(segments,
          { opacity: 0, x: -100},
          { 
            opacity: 1, 
            x: 0,
            duration: .5, 
            stagger: .5,
            ease: "power1.out"
          }
        );
      }
    }
  }, [neo4jPath]);

  // Fallback UI when no path is found
  if (!neo4jPath || !neo4jPath.segments || neo4jPath.segments.length === 0) {
    return <div className="text-black">
      <h1 className="flex justify-center text-2xl">No path found</h1>
      <h3 className="flex justify-center">Make sure all names are spelled correctly</h3>
      <h3 className="flex justify-center">Lesser known actors are not included in database</h3>
      </div>;
  }

  return (
    <div ref={containerRef} className="flex flex-col sm:flex-row w-full mb-8 justify-center items-center gap-1 sm:gap-1">  
      {/* First element (starting actor) - displayed separately to avoid duplicates */}
      {neo4jPath.segments[0] && (
        <div className="first-segment flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#5ba4f0] border-[#afc5db] p-4">
          <h1 className="font-bold">{neo4jPath.segments[0].start.properties.name}</h1>
        </div>
      )}
      
      {/* Map through segments and show arrow + end node for each */}
      {/* This pattern avoids duplicate elements since segments overlap (end of one = start of next) */}
      {neo4jPath.segments.map((segment: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {/* Arrow connecting elements */}
            <div className="arrow-segment flex items-center justify-center">
              <span className="text-gray-600 text-2xl sm:hidden">↓</span>
              <span className="hidden sm:inline text-gray-600 text-sm">→</span>
            </div>
            
            {/* Actor or Movie element */}
            <div className={segment.end.properties.name?
              "content-segment flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#5ba4f0] border-[#afc5db] p-4":
              "content-segment flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#c5e0fa] border-[#afc5db] p-4"}>
              <h1 className="font-bold">{segment.end.properties.name || segment.end.properties.title}</h1>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
