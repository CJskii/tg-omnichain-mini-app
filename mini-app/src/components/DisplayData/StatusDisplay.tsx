import { Cell } from "@telegram-apps/telegram-ui";

interface StatusDisplayProps {
  status: string | null;
}

const StatusDisplay: React.FC<StatusDisplayProps> = ({ status }) => {
  if (!status) return null;
  return <Cell subhead="Status">{status}</Cell>;
};

export default StatusDisplay;
