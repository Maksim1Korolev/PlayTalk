type GetImagePathParams = {
  avatarFileName?: string;
  gameName?: string;
};

const getImagePath = ({
  avatarFileName,
  gameName,
}: GetImagePathParams): string => {
  let imagePath = "";

  if (avatarFileName) {
    // Set the path for the avatar image
    imagePath = `https://testforavatars.s3.eu-north-1.amazonaws.com/avatars/${avatarFileName}`;
  } else if (gameName) {
    // Set the path for the game icon
    imagePath = `/public/images/gameIcons/${gameName}-icon.svg`;
  } else {
    // Fallback to the default image path
    imagePath = "/public/images/avatars/no-avatar.svg";
  }

  return imagePath;
};

export default getImagePath;
