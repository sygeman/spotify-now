import { Component } from "solid-js";
import { Motion, Presence } from "@motionone/solid";

const COVER_SIZE = 64;

interface TrackInfoProps {
  imageUrl?: string;
  artist?: string;
  name?: string;
  progress?: number;
}

export const TrackInfo: Component<TrackInfoProps> = ({
  imageUrl,
  artist,
  name,
  progress = 0,
}) => {
  return (
    <div class="w-full h-full relative overflow-hidden">
      <Presence>
        <Motion.div
          class="absolute left-0 top-0 h-full w-full bg-center bg-no-repeat bg-cover"
          style={{
            "background-image": `url(${imageUrl})`,
            filter: "blur(14px) brightness(0.3)",
          }}
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -COVER_SIZE }}
        />
      </Presence>
      <Motion.div
        class="absolute bottom-0 opacity-30 bg-background"
        style={{ left: `${COVER_SIZE}px`, height: `${COVER_SIZE}px` }}
        animate={{ width: `calc(${progress * 100}% - ${COVER_SIZE}px)` }}
      />
      <div class="flex absolute left-0 bottom-0">
        <div style={{ height: `${COVER_SIZE}px`, width: `${COVER_SIZE}px` }}>
          <Presence>
            <Motion.img
              src={imageUrl}
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -COVER_SIZE }}
            />
          </Presence>
        </div>
        <div class="flex justify-center px-4 flex-col">
          <span class="text-xl text-accent">{artist}</span>
          <span class="text-2xl text-white">{name}</span>
        </div>
      </div>
    </div>
  );
};
