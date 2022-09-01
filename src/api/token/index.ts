export interface Env {
  SN: KVNamespace;

  SPOTIFY_ID: string;
  SPOTIFY_SECRET: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const query = new URL(request.url).searchParams;
    const overlayId = query.get("overlayId");

    const userId = await env.SN.get(`overlay:${overlayId}`);
    let userDataAsString = await env.SN.get(`user:${userId}`);

    if (typeof userDataAsString !== "string") {
      return new Response("userData is not string", { status: 500 });
    }

    let userData: {
      access_token: string;
      refresh_token: string;
      expires_in: number;
    } = JSON.parse(userDataAsString);

    let accessToken = userData?.access_token;

    // Refresh Token
    if (userData.expires_in - Date.now() <= 0) {
      const params = new URLSearchParams();
      params.set("grant_type", "refresh_token");
      params.set("refresh_token", userData.refresh_token);

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

      const { access_token, refresh_token, expires_in } = tokenQuery;

      accessToken = access_token;

      await env.SN.put(
        `user:${userId}`,
        JSON.stringify({
          access_token,
          refresh_token,
          expires_in: Date.now() + expires_in * 1000,
        })
      );
    }

    return new Response(accessToken, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
        "Access-Control-Max-Age": "86400",
      },
    });
  },
};
