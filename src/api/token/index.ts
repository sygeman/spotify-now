export interface Env {
  SN: KVNamespace;

  SPOTIFY_ID: string;
  SPOTIFY_SCOPE: string;
  SPOTIFY_CALLBACK: string;
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

    let userData: { access_token: string } = JSON.parse(userDataAsString);

    return new Response(userData?.["access_token"]);
  },
};
