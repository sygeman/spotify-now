export const parseData = (data: any) => {
  let progress = 0;

  if (data) {
    progress = data?.progress_ms / data?.item?.duration_ms;
  }

  const id = data?.item?.id;
  const name = data?.item?.name;
  const artist = (data?.item?.artists || [])
    .map((artist: any) => artist?.name)
    .join(", ");
  const images = data?.item?.album?.images || [];

  return {
    id,
    imageUrl: images[images.length - 1]?.url,
    artist: artist,
    name: name,
    progress: progress,
  };
};
