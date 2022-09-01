import { nanoid } from "nanoid";

export interface Env {
  SN: KVNamespace;

  SPOTIFY_ID: string;
  SPOTIFY_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const query = new URL(request.url).searchParams;
    const oldOverlayId = query.get("overlayId");
    const overlayId = nanoid();

    const userId = await env.SN.get(`overlay:${oldOverlayId}`);

    if (!userId) {
      return new Response("userId is undefined", { status: 500 });
    }

    await Promise.all([
      env.SN.delete(`overlay:${oldOverlayId}`),
      env.SN.put(`overlay:${overlayId}`, userId),
      env.SN.put(`user:${userId}:overlayId`, overlayId),
    ]);

    return new Response(overlayId, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  },
};
