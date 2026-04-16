interface ArticleSchemaOptions {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt?: Date | null;
  updatedAt?: Date | null;
  authorName: string;
  siteUrl: string;
  siteName: string;
}

export function buildArticleSchema(opts: ArticleSchemaOptions) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    url: opts.url.startsWith("http") ? opts.url : `${opts.siteUrl}${opts.url}`,
    ...(opts.imageUrl && {
      image: {
        "@type": "ImageObject",
        url: opts.imageUrl.startsWith("http") ? opts.imageUrl : `${opts.siteUrl}${opts.imageUrl}`,
      },
    }),
    ...(opts.publishedAt && { datePublished: opts.publishedAt.toISOString() }),
    ...(opts.updatedAt && { dateModified: opts.updatedAt.toISOString() }),
    author: {
      "@type": "Person",
      name: opts.authorName,
    },
    publisher: {
      "@type": "Organization",
      name: opts.siteName,
      url: opts.siteUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": opts.url.startsWith("http") ? opts.url : `${opts.siteUrl}${opts.url}`,
    },
  };
}
