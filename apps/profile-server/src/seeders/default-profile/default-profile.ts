import { catalogClient } from "../../utils";
import { ProfileInteractor } from "../../profile-interactor";
import { seedProfile } from "../seed";

export const seedDefaultProfile = async ({
  profileInteractor,
}: {
  profileInteractor: ProfileInteractor;
}) => {
  await seedProfile({
    profileId: "default",
    profileInteractor,
    fetchTracks: (state) =>
      catalogClient.getTracks({
        limit: state.limit,
        offset: state.offset,
      }),
  });
};
