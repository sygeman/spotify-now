import { nanoid } from "nanoid";

export interface Env {
  SN: KVNamespace;

  SPOTIFY_ID: string;
  SPOTIFY_SECRET: string;
  SPOTIFY_CALLBACK: string;

  REDIRECT_URL: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const query = new URL(request.url).searchParams;
    const code = query.get("code") as string;

    const params = new URLSearchParams();
    params.set("grant_type", "authorization_code");
    params.set("code", code);
    params.set("redirect_uri", env.SPOTIFY_CALLBACK);

    const token = btoa(`${env.SPOTIFY_ID}:${env.SPOTIFY_SECRET}`);

    const tokenQuery: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    } = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }).then((res) => res.json());

    const userId = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${tokenQuery?.access_token}` },
    })
      .then((res) => res.json())
      .then((data: any) => data?.id);

    const { access_token, refresh_token, expires_in } = tokenQuery;

    await env.SN.put(
      `user:${userId}`,
      JSON.stringify({ access_token, refresh_token, expires_in })
    );

    const userOverlayId = `user:${userId}:overlayId`;

    let overlayId = await env.SN.get(userOverlayId);

    if (!overlayId) {
      overlayId = nanoid() as string;

      try {
        await Promise.all([
          env.SN.put(userOverlayId, overlayId),
          env.SN.put(`overlay:${overlayId}`, userId),
        ]);
      } catch (error) {
        console.log(error);
      }
    }

    return Response.redirect(`${env.REDIRECT_URL}/${overlayId}`);
  },
};
