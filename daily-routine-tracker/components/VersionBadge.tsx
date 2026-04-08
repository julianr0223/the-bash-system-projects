export function VersionBadge() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  const commit = process.env.NEXT_PUBLIC_APP_COMMIT;
  if (!version) return null;
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "var(--space-3) var(--space-4)",
        fontSize: "0.75rem",
        color: "var(--color-text-secondary)",
        fontFamily: "var(--font-body)",
      }}
    >
      v{version} ({commit})
    </footer>
  );
}
