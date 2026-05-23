function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getSearchTerms(query?: string) {
  if (!query?.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      query
        .trim()
        .split(/\s+/)
        .map((term) => term.trim())
        .filter((term) => term.length >= 2)
    )
  ).sort((firstTerm, secondTerm) => secondTerm.length - firstTerm.length);
}

type HighlightedTextProps = {
  query?: string;
  text: string;
};

export function HighlightedText({ query, text }: HighlightedTextProps) {
  const terms = getSearchTerms(query);

  if (terms.length === 0) {
    return <>{text}</>;
  }

  const matcher = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "gi");
  const lowerCaseTerms = new Set(terms.map((term) => term.toLowerCase()));

  return (
    <>
      {text.split(matcher).map((part, index) => {
        if (!part) {
          return null;
        }

        const isMatch = lowerCaseTerms.has(part.toLowerCase());

        if (!isMatch) {
          return <span key={`${part}-${index}`}>{part}</span>;
        }

        return (
          <mark
            className="box-decoration-clone rounded-md bg-amber-300/35 px-1 py-0.5 font-semibold text-foreground ring-1 ring-amber-300/40 dark:bg-amber-400/20 dark:ring-amber-400/30"
            key={`${part}-${index}`}
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}
