import { SpotifyCredentials } from "@lute/domain";
import SpotifyWebApi from "spotify-web-api-node";
import { HOST, SPOTIFT_CLIENT_ID, SPOTIFT_CLIENT_SECRET } from "./config";

const AUTH_CALLBACK_URL = `${HOST}/auth/callback`;

export const SPOTIFY_SCOPES = ["user-library-read"];

export const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFT_CLIENT_ID,
  clientSecret: SPOTIFT_CLIENT_SECRET,
  redirectUri: AUTH_CALLBACK_URL,
});

export const buildAuthorizedSpotifyApi = (credentials: SpotifyCredentials) => {
  const api = new SpotifyWebApi({
    clientId: SPOTIFT_CLIENT_ID,
    clientSecret: SPOTIFT_CLIENT_SECRET,
    redirectUri: AUTH_CALLBACK_URL,
  });
  api.setAccessToken(credentials.accessToken);
  api.setRefreshToken(credentials.refreshToken);
  return api;
};

type SpotifyApi = ReturnType<typeof buildAuthorizedSpotifyApi>;

export type SpotifyTrack = Awaited<
  ReturnType<SpotifyApi["getMySavedTracks"]>
>["body"]["items"][0]["track"];
