"use client";

type RichTextEditorProps = {
  label: string;
  defaultValue?: string;
};

export function RichTextEditor({
  label,
  defaultValue = "",
}: RichTextEditorProps) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <textarea
        className="min-h-48 w-full rounded-[1.5rem] border border-stone-300 px-4 py-3 text-sm text-stone-950 outline-none transition-colors focus:border-stone-950"
        defaultValue={defaultValue}
      />
    </label>
  );
}
