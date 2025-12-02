// prettier-ignore
// eslint-disable
// AUTO-GENERATED FILE
      
export type PageProps<T extends string> =
  T extends '/docs/[...slug]'
    ? { params: { slug: string[] }; searchParams?: URLSearchParams }
: never;

export type LayoutProps<T extends string> =
  T extends '/docs/[...slug]'
    ? { params: { slug: string[] }; searchParams?: URLSearchParams }
: never;

