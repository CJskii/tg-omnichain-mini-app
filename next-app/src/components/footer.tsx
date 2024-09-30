import Link from "next/link";
import {
  GitHubIcon,
  TelegramIcon,
  DiscordIcon,
  XIcon,
} from "@/assets/icons/social";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";

interface FooterData {
  label: string;
  href: string;
  children?: React.ReactNode;
}

const footerLinks: FooterData[] = [
  {
    label: "Terms of Service",
    href: "/terms",
  },
  {
    label: "Cookie Policy",
    href: "/cookie",
  },
  {
    label: "Legal Notice",
    href: "/legal",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const socialLinks: FooterData[] = [
  {
    label: "GitHub",
    href: "https://github.com/your-profile",
    children: <GitHubIcon />,
  },
  {
    label: "Telegram",
    href: "https://t.me/your-telegram",
    children: <TelegramIcon />,
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/your-invite",
    children: <DiscordIcon />,
  },
  {
    label: "Twitter/X",
    href: "https://twitter.com/your-profile",
    children: <XIcon />,
  },
];

export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent />
    </FooterContainer>
  );
};

const FooterContent: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-4 w-full">
      <Button className="text-sm">Home</Button>
      <Button className="text-sm">Mint</Button>
      <Button className="text-sm">Bridge</Button>
    </div>
  );
};

const FooterLink: React.FC<FooterData> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground hover:text-muted-foreground/60 transition"
    >
      {children}
    </Link>
  );
};

const FooterIconLink: React.FC<FooterData> = ({ href, label, children }) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-gray-500 hover:text-gray-900 transition"
    >
      {children}
    </Link>
  );
};

const FooterContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <footer className="bg-secondary rounded-t-xl pb-4 pt-4 md:p-16 md:py-4 flex flex-col lg:flex-row items-start justify-between gap-4">
      {children}
    </footer>
  );
};
