import { getLogger } from "../utils/logger";
import redisClient from "../utils/redisClient";
import S3 from "../utils/s3Client";

import Profile from "../schemas/Profile";

const logger = getLogger("ProfileService");
const REDIS_PROFILES_KEY =
  process.env.REDIS_PROFILES_USERNAME_KEY || "defaultProfileKey";
const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "testforavatars";
const AVATAR_FOLDER = "avatars/";

class ProfileService {
  static async listAvatars() {
    const params = {
      Bucket: S3_BUCKET_NAME,
      Prefix: AVATAR_FOLDER,
    };

    const data = await S3.listObjectsV2(params).promise();
    const avatarFiles =
      data.Contents?.map((item) => item.Key?.replace(AVATAR_FOLDER, "")) || [];

    return avatarFiles;
  }

  static async getRandomAvatar() {
    const avatarFiles = await ProfileService.listAvatars();

    if (avatarFiles.length === 0) {
      throw new Error("No avatars available in S3.");
    }

    const randomIndex = Math.floor(Math.random() * avatarFiles.length);
    return avatarFiles[randomIndex];
  }

  static async getAvatarUrl(avatarFileName: string) {
    const keyPath = `${AVATAR_FOLDER}${avatarFileName}`;
    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: keyPath,
      Expires: 3600,
    };
    return S3.getSignedUrlPromise("getObject", params);
  }

  static async addProfile({
    userId,
    username,
  }: {
    userId: string;
    username: string;
  }) {
    const randomAvatarFileName = await ProfileService.getRandomAvatar();
    const avatarFileName = randomAvatarFileName || "default.svg";

    const profile = {
      _id: userId,
      username,
      avatarFileName,
    };

    const newProfile = await Profile.create(profile);

    await redisClient.hSet(
      REDIS_PROFILES_KEY,
      newProfile.username,
      JSON.stringify(newProfile)
    );
    logger.info(
      `User added: ${newProfile.username} and Redis cache updated accordingly.`
    );
    return newProfile;
  }

  static async getProfiles() {
    const cachedProfiles = await redisClient.hGetAll(REDIS_PROFILES_KEY);

    if (cachedProfiles && Object.keys(cachedProfiles).length > 0) {
      logger.info("Fetched profiles from Redis cache.");
      return Object.values(cachedProfiles).map((profile) =>
        JSON.parse(profile)
      );
    }

    const profiles = await Profile.find();
    const profilesWithAvatars = await Promise.all(
      profiles.map(async (profile) => {
        const avatarUrl = await ProfileService.getAvatarUrl(
          profile.avatarFileName
        );
        return { ...profile.toObject(), avatarUrl };
      })
    );

    for (const profile of profilesWithAvatars) {
      await redisClient.hSet(
        REDIS_PROFILES_KEY,
        profile.username,
        JSON.stringify(profile)
      );
    }

    logger.info("Fetched profiles from database and cached in Redis.");
    return profilesWithAvatars;
  }

  static async getProfileByUsername(username: string) {
    const cachedProfile = await redisClient.hGet(REDIS_PROFILES_KEY, username);

    if (cachedProfile) {
      logger.info(`Cache hit for profile: ${username}`);
      return JSON.parse(cachedProfile);
    }

    const profile = await Profile.findOne({ username });
    if (profile) {
      await redisClient.hSet(
        REDIS_PROFILES_KEY,
        username,
        JSON.stringify(profile)
      );
      logger.info(`Fetched and cached profile: ${username}`);
    }

    return profile;
  }

  // Unused functions for now

  // static async deleteProfile(id: string) {
  //   if (!id) {
  //     throw new Error("Invalid profile ID");
  //   }

  //   const deletedProfile = await Profile.findByIdAndDelete(id);
  //   if (deletedProfile) {
  //     await redisClient.hDel(REDIS_PROFILES_KEY, deletedProfile.username);
  //     logger.info(
  //       `Deleted profile: ${deletedProfile.username} and updated Redis cache accordingly.`
  //     );
  //   }
  //   return deletedProfile;
  // }

  // static async getProfileById(id: string) {
  //   const cacheKey = `profile:id:${id}`;
  //   const cachedProfile = await redisClient.get(cacheKey);
  //   if (cachedProfile) {
  //     logger.info(`Fetched profile with ID ${id} from Redis cache.`);
  //     return JSON.parse(cachedProfile);
  //   }

  //   const profile = await Profile.findById(id);
  //   if (profile) {
  //     await redisClient.set(cacheKey, JSON.stringify(profile), {
  //       EX: 3600,
  //     });
  //     logger.info(
  //       `Fetched profile with ID ${id} from database and cached in Redis.`
  //     );
  //   }
  //   return profile;
  // }

  // static async updateProfile(profile: any) {
  //   if (!profile._id) {
  //     throw new Error("Invalid profile ID");
  //   }

  //   const updatedProfile = await Profile.findByIdAndUpdate(
  //     profile._id,
  //     profile,
  //     {
  //       new: true,
  //     }
  //   );
  //   if (updatedProfile) {
  //     await redisClient.hSet(
  //       REDIS_PROFILES_KEY,
  //       updatedProfile.username,
  //       JSON.stringify(updatedProfile)
  //     );
  //     logger.info(
  //       `Updated profile: ${updatedProfile.username} and Redis cache updated accordingly.`
  //     );
  //   }
  //   return updatedProfile;
  // }
}

export default ProfileService;
