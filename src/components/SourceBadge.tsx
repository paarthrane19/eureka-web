import { BookOpen, FileText, FlaskConical, GraduationCap, Database } from "lucide-react";

import { externalUrl } from "@/lib/links";
import type { Source } from "@/lib/types";

const ICONS: Record<string, typeof BookOpen> = {
  journal: BookOpen,
  university: GraduationCap,
  article: FileText,
  dataset: Database,
  preprint: FlaskConical,
};

export function SourceBadge({ source }: { source: Source }) {
  const Icon = ICONS[source.source_type] ?? FileText;
  const href = externalUrl(source.url);

  const body = (
    <>
      <Icon size={16} className="shrink-0 text-muted group-hover:text-accent" />
      <span className="min-w-0">
        <span className="block font-mono text-2xs uppercase tracking-widest text-faint">
          {String(source.source_type)}
        </span>
        <span className="block truncate font-sans text-sm text-text">
          {source.title}
        </span>
      </span>
    </>
  );

  // An unusable source URL still names a real source, so keep the citation
  // visible — just not as a click target that would 404 or do nothing.
  if (!href) {
    return (
      <div className="group flex items-center gap-3 px-3 py-2 hairline">
        {body}
      </div>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-center gap-3 px-3 py-2 hairline transition duration-fast hover:border-accent"
    >
      {body}
    </a>
  );
}
