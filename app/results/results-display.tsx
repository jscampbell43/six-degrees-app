'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface ResultsDisplayProps {
  neo4jPath: any;
}

export default function ResultsDisplay({ neo4jPath }: ResultsDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && neo4jPath?.segments) {
      // Get the first element
      const firstElement = containerRef.current.querySelector('.first-segment');
      // Get all the arrow elements
      const arrows = containerRef.current.querySelectorAll('.arrow-segment');
      // Get all the actor/movie elements
      const segments = containerRef.current.querySelectorAll('.content-segment');

      let zIndexSet = 100
      
      // First element - appears first
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

      // Animate arrows - each waits for previous to complete
      gsap.fromTo(arrows,
        { opacity: 0, x: -100},
        { 
          zIndex: -10,
          opacity: 1, 
          x: 0,
          duration: .5, 
          stagger: .5, // Wait for previous to complete (duration matches stagger)
          ease: "power1.out"
        }
      );

      // Animate segments - each waits for previous to complete
      gsap.fromTo(segments,
        { opacity: 0, x: -100},
        { 
          opacity: 1, 
          x: 0,
          duration: .5, 
          stagger: .5, // Wait for previous to complete (duration matches stagger)
          ease: "power1.out"
        }
      );
    }
  }, [neo4jPath]);

  if (!neo4jPath || !neo4jPath.segments || neo4jPath.segments.length === 0) {
    return <div className="text-black">
      <h1 className="flex justify-center text-2xl">No path found</h1>
      <h3 className="flex justify-center">Make sure all names are spelled correctly</h3>
      <h3 className="flex justify-center">Lesser known actors are not included in database</h3>
      </div>;
  }

  return (
    <div ref={containerRef} className="flex w-full mb-8 justify-center items-center">  
      {/* Show the first element (start of first segment) */}
      {neo4jPath.segments[0] && (
        <div className="first-segment flex items-center justify-center text-center outline-2 border-2 rounded-md bg-[#5ba4f0] border-[#afc5db] p-4">
          <h1 className="font-bold">{neo4jPath.segments[0].start.properties.name}</h1>
        </div>
      )}
      
      {/* Map through segments and show arrow + end node for each */}
      {neo4jPath.segments.map((segment: any, index: number) => {
        return (
          <React.Fragment key={index}>
            {/* Arrow */}
            <div className="arrow-segment flex items-center justify-center">
              <div className="w-8 border-t-2 border-gray-600 transform"></div>
            </div>
            
            {/* Segment containing either an Actor name or Movie title */}
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
