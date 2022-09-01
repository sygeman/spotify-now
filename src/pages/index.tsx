import { useNavigate, useSearchParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import copy from "copy-to-clipboard";

const IndexPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [overlayId, setOverlayId] = createSignal(
    localStorage.getItem("overlayId")
  );
  const overlayLink = createMemo(() => {
    if (!overlayId()) return "";
    return `${window?.location?.origin}/${overlayId()}`;
  });

  createEffect(() => {
    if (searchParams.overlayId) {
      localStorage.setItem("overlayId", searchParams.overlayId);
      setOverlayId(searchParams.overlayId);
      navigate("/");
    }
  });

  const copyOverlayLink = () => copy(overlayLink());

  return (
    <div class="insert-0 flex h-screen w-screen justify-center items-center">
      <Show when={overlayLink()}>
        <div class="flex items-center gap-x-3 font-medium">
          <div
            class="border-1 px-4 py-1 rounded border-slate-600 relative"
            onClick={copyOverlayLink}
          >
            <span class="blur">{overlayLink()}</span>
            <span class="absolute left-0 w-full text-center cursor-pointer">
              Click To Copy Widget URL
            </span>
          </div>
          <button
            class="bg-slate-600 hover:bg-slate-600/80 transition delay-75 px-2 py-1 rounded"
            onClick={copyOverlayLink}
          >
            Copy
          </button>
        </div>
      </Show>
      <Show when={!overlayId()}>
        <a
          class="px-2 py-1 rounded bg-slate-700 hover:bg-slate-800"
          href="https://sn-login.sgmn.workers.dev"
        >
          Sign in
        </a>
      </Show>
    </div>
  );
};

export default IndexPage;
