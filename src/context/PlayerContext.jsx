/* eslint-disable react/prop-types */
import React, { useEffect, useState, createContext, useRef } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  const playWithId = async (id) => {
    await setTrack(songsData[id]);
    audioRef.current.load(); // Ensure the new track is loaded
    audioRef.current.play();
    setPlayStatus(true);
  };

  const previous = async () => {
    if (track.id > 0) {
      await setTrack(songsData[track.id - 1]);
      audioRef.current.load(); // Ensure the new track is loaded
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const next = async () => {
    if (track.id < songsData.length - 1) {
      await setTrack(songsData[track.id + 1]);
      audioRef.current.load(); // Ensure the new track is loaded
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const seekSong = (e) => {
    const seekPosition =
      (e.nativeEvent.offsetX / seekBg.current.offsetWidth) *
      audioRef.current.duration;
    if (!isNaN(seekPosition)) {
      audioRef.current.currentTime = seekPosition;
    }
  };

  useEffect(() => {
    const audio = audioRef.current; // Copy the current value of audioRef to a variable

    const updateTime = () => {
      if (audio && !isNaN(audio.duration)) {
        seekBar.current.style.width =
          (audio.currentTime / audio.duration) * 100 + "%";
        setTime({
          currentTime: {
            second: Math.floor(audio.currentTime % 60),
            minute: Math.floor(audio.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audio.duration % 60),
            minute: Math.floor(audio.duration / 60),
          },
        });
      }
    };

    if (audio) {
      audio.ontimeupdate = updateTime;
      audio.onloadedmetadata = updateTime; // Update time when metadata is loaded
    }

    return () => {
      if (audio) {
        audio.ontimeupdate = null;
        audio.onloadedmetadata = null;
      }
    };
  }, [audioRef, track]); // Add track to the dependency array to ensure updates when the track changes

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    next,
    previous,
    seekSong,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
