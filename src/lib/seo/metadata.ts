import type { Metadata } from "next";

const SITE_NAME = "ADU Build LA";
const DEFAULT_DESCRIPTION =
  "ADU design and construction specialists in Los Angeles. Custom ADUs starting from $150,000. Design, permitting, and full build services.";

interface BuildMetadataOptions {
  title: string;
  description?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImageUrl?: string | null;
  noIndex?: boolean;
  siteUrl?: string;
}

export function buildMetadata({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImageUrl,
  noIndex = false,
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://adubuildla.com",
}: BuildMetadataOptions): Metadata {
  const resolvedDescription = description || DEFAULT_DESCRIPTION;
  const resolvedOgTitle = ogTitle || title;
  const resolvedOgDescription = ogDescription || resolvedDescription;
  // Use provided image, or fall back to the generated OG image route
  const resolvedOgImage = ogImageUrl
    ? ogImageUrl.startsWith("http")
      ? ogImageUrl
      : `${siteUrl}${ogImageUrl}`
    : `${siteUrl}/opengraph-image`;

  const canonicalUrl = canonical
    ? canonical.startsWith("http")
      ? canonical
      : `${siteUrl}${canonical}`
    : undefined;

  return {
    title: { absolute: `${title} | ${SITE_NAME}` },
    description: resolvedDescription,
    ...(canonicalUrl && {
      alternates: { canonical: canonicalUrl },
    }),
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      url: canonicalUrl,
      images: [{ url: resolvedOgImage, width: 1200, height: 630, alt: resolvedOgTitle }],
      type: "website",
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedOgTitle,
      description: resolvedOgDescription,
      images: [resolvedOgImage],
    },
  };
}

export function buildArticleMetadata(
  opts: BuildMetadataOptions & {
    publishedAt?: Date | null;
    updatedAt?: Date | null;
    authorName?: string;
  }
): Metadata {
  const base = buildMetadata(opts);
  return {
    ...base,
    openGraph: {
      ...base.openGraph,
      type: "article",
      publishedTime: opts.publishedAt?.toISOString(),
      modifiedTime: opts.updatedAt?.toISOString(),
      authors: opts.authorName ? [opts.authorName] : undefined,
    },
  };
}
