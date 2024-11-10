import mongoose from "mongoose";

import { getLogger } from "../utils/logger";
import redisClient from "../utils/redisClient";
import S3 from "../utils/s3Client";

import Profile, { ProfileType } from "../schemas/Profile";

const logger = getLogger("ProfileService");
const REDIS_PROFILES_KEY = process.env.REDIS_USERS_KEY || "defaultProfileKey";
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

  static async getProfiles() {
    const cachedProfiles = await redisClient.get(REDIS_PROFILES_KEY);
    if (cachedProfiles) {
      logger.info("Fetched profiles from Redis cache.");
      return JSON.parse(cachedProfiles);
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

    await redisClient.set(
      REDIS_PROFILES_KEY,
      JSON.stringify(profilesWithAvatars || []),
      {
        EX: 3600,
      }
    );
    logger.info("Fetched profiles from database and cached in Redis.");
    return profilesWithAvatars;
  }

  static async addProfile(username: string) {
    // Choose a random avatar for the new profile
    const randomAvatarFileName = await ProfileService.getRandomAvatar();

    const avatarFileName = randomAvatarFileName || "grand.svg";

    const profile = {
      username,
      avatarFileName,
    };
    const newProfile = await Profile.create(profile);
    await redisClient.del(REDIS_PROFILES_KEY);
    logger.info(`Added new profile: ${newProfile._id}`);
    return newProfile;
  }

  static async deleteProfile(id: string) {
    if (!id) {
      throw new Error("Invalid profile ID");
    }

    const deletedProfile = await Profile.findByIdAndDelete(id);
    await redisClient.del(REDIS_PROFILES_KEY);
    logger.info(`Deleted profile: ${id}`);
    return deletedProfile;
  }

  static async getProfileByUsername(username: string) {
    const cacheKey = `profile:username:${username}`;
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      logger.info(`Fetched profile ${username} from Redis cache.`);
      return JSON.parse(cachedProfile);
    }

    const profile = await Profile.findOne({ username });
    if (profile) {
      await redisClient.set(cacheKey, JSON.stringify(profile), {
        EX: 3600,
      });
      logger.info(
        `Fetched profile ${username} from database and cached in Redis.`
      );
    }
    return profile;
  }

  static async getProfileById(id: string) {
    const cacheKey = `user:id:${id}`;
    const cachedProfile = await redisClient.get(cacheKey);
    if (cachedProfile) {
      logger.info(`Fetched profile with ID ${id} from Redis cache.`);
      return JSON.parse(cachedProfile);
    }

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid profile ID");
    }

    const profile = await Profile.findById(id);
    if (profile) {
      await redisClient.set(cacheKey, JSON.stringify(profile), {
        EX: 3600,
      });
      logger.info(
        `Fetched profile with ID ${id} from database and cached in Redis.`
      );
    }
    return profile;
  }

  static async updateProfile(profile: ProfileType) {
    if (!profile._id) {
      throw new Error("Invalid profile ID");
    }

    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      profile,
      {
        new: true,
      }
    );
    await redisClient.del(REDIS_PROFILES_KEY);
    if (updatedProfile) {
      await redisClient.del(`profile:id:${updatedProfile._id}`);
      await redisClient.del(`profile:username:${updatedProfile.username}`);
      logger.info(`Updated profile: ${updatedProfile._id}`);
    }
    return updatedProfile;
  }
}

export default ProfileService;
