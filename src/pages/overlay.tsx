import { useParams } from "@solidjs/router";
import { createEffect, createSignal, onCleanup, Show } from "solid-js";
import { TrackInfo } from "../components/track-info";
import { getToken } from "../utils/get-token";
import { parseData } from "../utils/parse";

const OverlayPage = () => {
  const { id: overlayId } = useParams();
  const [token, setToken] = createSignal();
  const [data, setData] = createSignal<any>(null);

  getToken(overlayId).then(setToken);

  const checkWhatPlayingNow = () => {
    return fetch("https://api.spotify.com/v1/me/player", {
      headers: { authorization: `Bearer ${token()}` },
    })
      .then((data) => data.json())
      .then((data) => setData(parseData(data)))
      .catch((error) => {
        console.log(error);
        getToken(overlayId, true).then(setToken);
      });
  };

  createEffect(() => {
    if (token()) {
      let interval = setInterval(checkWhatPlayingNow, 5000);
      checkWhatPlayingNow();

      onCleanup(() => {
        if (interval) clearInterval(interval);
      });
    }
  });

  return (
    <div class="h-screen bg-background flex">
      <Show when={data()}>
        <TrackInfo
          imageUrl={data()?.imageUrl}
          artist={data()?.artist}
          name={data()?.name}
          progress={data()?.progress}
        />
      </Show>
    </div>
  );
};

export default OverlayPage;
