export function PageShell({ children, className = "" }) {
  return (
    <main className={`w-full max-w-7xl px-4 py-10 mx-auto sm:px-6 lg:px-8 ${className}`}>
      {children}
    </main>
  );
}
