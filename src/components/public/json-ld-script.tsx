export function JsonLdScript({ value }: { value: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }}
      type="application/ld+json"
    />
  );
}
