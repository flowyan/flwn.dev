"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Dancer.module.css";

interface DancerProps {
  nowPlaying: boolean;
  scrobbleCount: number;
}

export function Dancer({ nowPlaying, scrobbleCount }: DancerProps) {
  const dancerRef = useRef<HTMLImageElement>(null);
  const intervalRef = useRef<number>(null);

  const timeBetweenDancers = 30000;
  const dancers = [
    "alanwake.avif",
    "andrewcooper.avif",
    "rasputin.avif",
    "severance.avif",
    "severance2.avif",
    "sourpls.avif",
    "spiderman.avif",
    "spidermanlighting.avif",
    "stableronaldo.avif",
    "terry.avif",
  ];

  function getRandomDancer() {
    const randomIndex = Math.floor(Math.random() * dancers.length);
    return "/dancers/" + dancers[randomIndex];
  }

  function setupInterval() {
    if (nowPlaying && dancerRef.current) {
      dancerRef.current.src = getRandomDancer();
      const interval = setInterval(() => {
        if (dancerRef.current) {
          dancerRef.current.src = getRandomDancer();
        }
      }, timeBetweenDancers);
      intervalRef.current = interval;
    }
  }

  useEffect(() => {
    setupInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nowPlaying]);

  return (
    <div className={styles.dancer}>
      <img
        onClick={() => {
          if (nowPlaying && dancerRef.current) {
            dancerRef.current.src = getRandomDancer();
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              setupInterval();
            }
          }
        }}
        ref={dancerRef}
        title={nowPlaying ? "the dancer :)" : "the dancer is sleeping."}
        className={styles.dancerImg}
        src={nowPlaying ? getRandomDancer() : "/dancers/eepy.webp"}
        alt="Dancing Animation"
      />
      <a
        href="https://www.last.fm/user/Flowyan"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.scrobbleCount}
        title="Total Scrobbles"
      >
        {scrobbleCount}
        <img
          src={"/img/lastfm.png"}
          alt="Last.fm Logo"
          className="w-6 h-6 inline-block ml-1"
        />
      </a>
    </div>
  );
}
