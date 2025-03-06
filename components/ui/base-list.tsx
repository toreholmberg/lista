import Link from "next/link";
import { Button } from "./button";

export default function BaseList({ children }: { children: React.ReactNode }) {
  return <ul className="space-y-2">{children}</ul>;
}

export function BaseListEmpty({ children }: { children: React.ReactNode }) {
  return <li className="text-center text-muted-foreground py-4">{children}</li>;
}

export function BaseListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center border rounded-md bg-card h-12 has-[>a]:hover:bg-accent transition-colors">
      {children}
    </li>
  );
}

export function BaseListLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="flex-grow p-3">
      {children}
    </Link>
  );
}

export function BaseListButton(props: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const { children, ...rest } = props;
  return (
    <Button
      {...rest}
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-destructive cursor-pointer last:mr-3"
    >
      {children}
    </Button>
  );
}
