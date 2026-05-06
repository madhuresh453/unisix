export function PageShell({ children, className = "" }) {
  return (
    <main className={`w-full px-6 py-10 ${className}`}>
      {children}
    </main>
  );
}
