export function ArtifactPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="flex min-h-[200px] w-full items-center justify-center border border-[var(--color-grid-strong)] bg-[#eff2ff] px-6 py-16 text-center"
      style={{ color: "var(--color-primary)" }}
    >
      <p className="max-w-md text-[11px] font-bold uppercase tracking-[0.2em] opacity-70">
        ARTIFACT - {label}
      </p>
    </div>
  );
}
