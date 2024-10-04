import { useEffect } from "react";
import { useBackButton } from "@telegram-apps/sdk-react";
import { Button } from "@telegram-apps/telegram-ui";
import { IconButton } from "@telegram-apps/telegram-ui";

interface BackButtonProps {
  type: string;
  children?: React.ReactNode;
}

enum BackButtonType {
  icon = "icon",
  text = "text",
}

export const BackButton: React.FC<BackButtonProps> = ({ children, type }) => {
  const backButton = useBackButton();

  const handleBackButtonClick = () => {
    console.log("Back button clicked");
    window.history.back();
  };

  useEffect(() => {
    if (backButton) {
      backButton.show();
      backButton.on("click", handleBackButtonClick);

      return () => {
        backButton.hide();
        backButton.off("click", handleBackButtonClick);
      };
    }
  }, [backButton]);

  if (type === BackButtonType.icon) {
    return <IconButton onClick={handleBackButtonClick}>{children}</IconButton>;
  }

  return <Button onClick={handleBackButtonClick}>Back</Button>;
};
