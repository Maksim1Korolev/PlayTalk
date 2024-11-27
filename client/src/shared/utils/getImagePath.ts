type GetImagePathParams = {
  collection?: ImageCollection;
  fileName?: string;
};

type ImageCollection = "appIcons" | "gameIcons" | "avatars";

const getImagePath = ({ collection, fileName }: GetImagePathParams): string => {
  let imagePath = "";

  if (collection && fileName) {
    const folderName = collection;
    imagePath = `https://testforavatars.s3.eu-north-1.amazonaws.com/${folderName}/${fileName}`;

    if (collection === "gameIcons" || collection === "appIcons") {
      imagePath = `/images/${folderName}/${fileName}-icon.svg`;
    }
  } else {
    // Fallback to the default image path
    imagePath = "/images/avatars/no-avatar.svg";
  }

  return imagePath;
};

export default getImagePath;
