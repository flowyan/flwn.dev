// TODO: Improve this, currently the loading kinda sucks, maybe move it back to astro and use clientside script to re-fetch
import { useCallback, useEffect, useState } from "react";
import musicjak from "../../assets/musicjak.png";
import { Dancer } from "../Dancer/Dancer";
import ModuleBar from "../ModuleBar/ModuleBar";

import styles from "./LastFmModule.module.css";

interface LastFmTrack {
  name: string;
  url: string;
  artist: { "#text": string };
  album: { "#text": string };
  image: { "#text": string }[];
  "@attr"?: {
    nowplaying?: string;
  };
}

interface LastFmResponse {
  recenttracks: {
    track: LastFmTrack[];
    "@attr": {
      total: string;
    };
  };
}

export default function LastFmModule() {
  const [track, setTrack] = useState<LastFmTrack | null>(null);
  const [scrobbleCount, setScrobbleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const updateLastFm = useCallback(async () => {
    try {
      const response = await fetch("https://api.flwn.dev/lastfm", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Last.fm API returned ${response.status}`);
      }

      const data: LastFmResponse = await response.json();
      const latestTrack = data.recenttracks.track[0];

      if (latestTrack) {
        setTrack(latestTrack);
      }

      setScrobbleCount(Number(data.recenttracks["@attr"].total) || 0);
    } catch (error) {
      console.error("Failed to update Last.fm:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void updateLastFm();

    const interval = window.setInterval(() => {
      void updateLastFm();
    }, 30_000);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        void updateLastFm();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [updateLastFm]);

  const nowPlaying = track?.["@attr"]?.nowplaying === "true";
  const imageUrl = track?.image[2]?.["#text"] || musicjak.src;

  return (
    <div className={styles.lastFmModuleContainer}>
      <ModuleBar
        title={nowPlaying ? "listening to" : "last listened to"}
        titleDescription="the music i'm listening/listened to"
        icon={musicjak.src}
        iconDescription="look at him go"
      />
      <div className={styles.lastFmModule}>
        <div className="flex flex-row gap-2 items-center p-2">
          {track ? (
            <>
              <a href={track.url} target="_blank" rel="noopener noreferrer">
                <img
                  className={styles.coverArt}
                  src={imageUrl}
                  alt="Album Art"
                  title="Album Art"
                />
              </a>

              <div className="flex flex-col gap-1 truncate">
                <p title="Track Title">{track.name}</p>
                <p title="Artist Name">{track.artist["#text"]}</p>
                <p title="Album Title">{track.album["#text"]}</p>
              </div>
            </>
          ) : (
            <>
              <img
                className={styles.coverArt}
                src={imageUrl}
                alt="Album Art"
                title="Album Art"
              />
              <div className="flex flex-col gap-1 truncate">
                <p title="Track Title">{"Loading from LastFm..."}</p>
              </div>
            </>
          )}
        </div>

        <Dancer nowPlaying={nowPlaying} scrobbleCount={scrobbleCount} />
      </div>
    </div>
  );
}
