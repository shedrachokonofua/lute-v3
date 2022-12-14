import axios from "axios";
import * as qs from "qs";
import {
  AssessmentModel,
  Recommendation,
  RecommendationParameters,
} from "@lute/domain";
import { config } from "./config";

const isBrowser = typeof window !== "undefined";
const host = isBrowser
  ? config.luteServerUrl.browserSide
  : config.luteServerUrl.serverSide;
const http = axios.create({ baseURL: host });

export const api = {
  async getRecommendations(
    params: Omit<RecommendationParameters, "model">
  ): Promise<Recommendation[]> {
    const response = await http.get(
      `/recommendation/albums?${qs.stringify({
        model: AssessmentModel.QuantileRank,
        ...params,
      })}`
    );
    return response.data?.data || [];
  },
  async getGenres() {
    const response = await http.get("/albums/genres");
    return response.data?.data || [];
  },
};
