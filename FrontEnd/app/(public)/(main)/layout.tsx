export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="pt-20">{children}</main>;
}
