import { Component } from "solid-js";

const COVER_SIZE = 64;

interface TrackInfoProps {
  imageUrl: string;
  artist: string;
  name: string;
  progress: number;
}

export const TrackInfo: Component<TrackInfoProps> = (props) => {
  return (
    <div class="w-full h-full relative overflow-hidden">
      <div
        class="absolute left-0 top-0 h-full w-full bg-center bg-no-repeat bg-cover"
        style={{
          "background-image": `url(${props.imageUrl})`,
          filter: "blur(14px) brightness(0.3)",
        }}
      />

      <div
        class="absolute bottom-0 opacity-30 bg-background"
        style={{ left: `${COVER_SIZE}px`, height: `${COVER_SIZE}px` }}
      />
      <div class="flex absolute left-0 bottom-0">
        <div style={{ height: `${COVER_SIZE}px`, width: `${COVER_SIZE}px` }}>
          <img src={props.imageUrl} />
        </div>
        <div class="flex justify-center px-4 flex-col">
          <span class="text-xl text-accent">{props.artist}</span>
          <span class="text-2xl text-white">{props.name}</span>
        </div>
      </div>
    </div>
  );
};
