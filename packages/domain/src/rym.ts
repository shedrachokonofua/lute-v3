import { parse as parseFormattedDate } from "date-fns";

export enum PageType {
  Artist = "artist",
  Album = "album",
  Chart = "chart",
  Search = "search",
}

export interface ArtistPage {
  name: string;
  albums: {
    name: string;
    fileName: string;
  }[];
}

export interface Track {
  name: string;
  lengthSeconds?: number;
  rating?: number;
  position?: string;
}

export interface AlbumPage {
  name: string;
  artists: {
    name: string;
    fileName: string;
  }[];
  rating: number;
  ratingCount: number;
  primaryGenres: string[];
  secondaryGenres: string[];
  descriptors: string[];
  releaseDate: Date;
  tracks: Track[];
  releaseDateString?: string;
}

export interface ChartParameters {
  pageNumber: number;
  yearsRangeStart: number;
  yearsRangeEnd: number;
  includePrimaryGenres?: string[];
  includeSecondaryGenres?: string[];
  excludePrimaryGenres?: string[];
  excludeSecondaryGenres?: string[];
  includeDescriptors?: string[];
  excludeDescriptors?: string[];
}

export interface ChartPageAlbumEntry {
  position: number;
  fileName: string;
  albumData: Partial<AlbumPage>;
}

export interface ChartPage {
  parameters: ChartParameters;
  albums: ChartPageAlbumEntry[];
}

export const parseReleaseDateString = (value: string) =>
  parseFormattedDate(value, "dd MMMM yyyy", new Date());

export interface SearchBestMatch {
  name: string;
  artists: {
    name: string;
    fileName: string;
  }[];
  fileName: string;
}

export type AlbumDocument = Partial<AlbumPage> & {
  fileId: string;
  fileName: string;
};

export type PutAlbumPayload = Partial<AlbumDocument>;

export interface ChartDocumentAlbumEntry {
  position: number;
  fileName: string;
}

export interface ChartDocument {
  fileId: string;
  fileName: string;
  parameters: ChartParameters;
  albums: ChartDocumentAlbumEntry[];
}

export type PutChartPayload = ChartPage & {
  fileName: string;
  fileId: string;
};

const SUPPORTED_RELEASE_TYPES = ["album", "mixtape", "ep"];

export const isLuteAlbumFileName = (fileName: string) =>
  SUPPORTED_RELEASE_TYPES.some((releaseType) =>
    fileName.startsWith(`release/${releaseType}/`)
  );

export const isLuteChartFileName = (fileName: string) =>
  /^charts\/(\w+)\/(album|mixtape|ep)\//.test(fileName);
