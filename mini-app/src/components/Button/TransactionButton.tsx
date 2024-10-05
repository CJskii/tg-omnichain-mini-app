import { Button } from "@telegram-apps/telegram-ui";

interface TransactionButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

const TransactionButton: React.FC<TransactionButtonProps> = ({
  onClick,
  label,
  disabled,
}) => (
  <Button onClick={onClick} stretched disabled={disabled}>
    {label}
  </Button>
);

export default TransactionButton;
