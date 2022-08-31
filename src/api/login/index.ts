export interface Env {
  SPOTIFY_ID: string;
  SPOTIFY_SCOPE: string;
  SPOTIFY_CALLBACK: string;
}

export default {
  async fetch(_request: Request, env: Env): Promise<Response> {
    const params = new URLSearchParams();
    params.set("response_type", "code");
    params.set("client_id", env.SPOTIFY_ID);
    params.set("scope", env.SPOTIFY_SCOPE);
    params.set("redirect_uri", env.SPOTIFY_CALLBACK);
    return Response.redirect(
      `https://accounts.spotify.com/authorize?${params.toString()}`
    );
  },
};
