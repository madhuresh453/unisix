export function PageShell({ children, className = "" }) {
  return (
    <main className={`w-full max-w-[1400px] px-6 py-10 mx-auto ${className}`}>
      {children}
    </main>
  );
}
