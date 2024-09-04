type GetImagePathParams = {
  avatarFileName?: string;
  gameName?: string;
};

const getImagePath = ({
  avatarFileName,
  gameName,
}: GetImagePathParams): string => {
  let imagePath = "";

  try {
    if (avatarFileName) {
      // Set the path for the avatar image
      imagePath = `/public/images/avatarIcons/${avatarFileName}`;
    } else if (gameName) {
      // Set the path for the game icon
      imagePath = `/public/images/gameIcons/${gameName}-icon.svg`;
    } else {
      // Fallback to the default image path
      imagePath = "/public/images/avatarIcons/default-avatar.svg";
    }
  } catch (error) {
    console.error(`Failed to load image path: ${error}`);
    // Fallback to default path in case of error
    imagePath = "/public/images/avatarIcons/default-avatar.svg";
  }

  return imagePath;
};

export default getImagePath;
