import React from "react";
import { Modal, Button } from "@telegram-apps/telegram-ui";

import { Mint } from "../Mint";

interface MintModalProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const MintModal: React.FC<MintModalProps> = ({
  open: isModalOpen,
  onOpenChange: setIsModalOpen,
}) => {
  return (
    <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Mint />
    </Modal>
  );
};
