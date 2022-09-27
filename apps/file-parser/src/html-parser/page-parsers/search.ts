import { FileSavedEvent, SearchBestMatch, xRay } from "@lute/shared";
import { logger } from "../../logger";

export const parseSearch = async (
  event: FileSavedEvent,
  html: string
): Promise<SearchBestMatch | undefined> => {
  const results = (await xRay(html, ".infobox", [
    {
      name: "a.searchpage",
      fileName: "a.searchpage@href | linkToFileName",
      artists: ["a.artist@text | trim"],
    },
  ])) as SearchBestMatch[];

  const filteredResults = results.filter((result) =>
    result.fileName.startsWith("release/album")
  );

  if (filteredResults.length === 0) {
    logger.info({ event }, "No results found");
    return undefined;
  }

  const bestMatch = filteredResults[0];
  logger.info({ event, bestMatch }, "Best match found");
  return bestMatch;
};