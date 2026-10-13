import RootShell, { generateRootMetadata } from "@/components/RootShell";

export { viewport } from "@/components/RootShell";
export const generateMetadata = generateRootMetadata;

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="en">{children}</RootShell>;
}
