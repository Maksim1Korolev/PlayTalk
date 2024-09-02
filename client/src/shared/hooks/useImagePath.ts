import { useEffect, useState } from "react";

const useImagePath = (avatarFileName?: string, gameName?: string) => {
  const [imagePath, setImagePath] = useState<string>("");

  useEffect(() => {
    const loadImagePath = async () => {
      try {
        if (avatarFileName) {
          // Set the path for the avatar image
          setImagePath(`images/${avatarFileName}`);
        } else if (gameName) {
          // Set the path for the game icon
          setImagePath(`@/shared/assets/icons/gameIcons/${gameName}-icon.svg`);
        } else {
          // Fallback to the default image path
          setImagePath("images/default-avatar.svg");
        }
      } catch (error) {
        console.error(`Failed to load image path: ${error}`);
        // Fallback to default path in case of error
        setImagePath("images/default-avatar.svg");
      }
    };

    loadImagePath();
  }, [avatarFileName, gameName]);

  return imagePath;
};

export default useImagePath;
