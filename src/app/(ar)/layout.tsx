import RootShell, { generateRootMetadata } from "@/components/RootShell";

export { viewport } from "@/components/RootShell";
export const generateMetadata = generateRootMetadata;

export default function ArLayout({ children }: { children: React.ReactNode }) {
  return <RootShell locale="ar">{children}</RootShell>;
}
