import { cache } from "react";

export const checkOrganisationSlugExists = cache(
  async function checkOrganisationSlugExists(
    orgSlug: string
  ): Promise<boolean> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl) return true;

    try {
      const res = await fetch(
        `${baseUrl.replace(/\/$/, "")}/organisations/slug-exists/${encodeURIComponent(orgSlug)}`,
        { next: { revalidate: 60 } }
      );

      if (!res.ok) return true;

      const body = await res.json();
      return Boolean(body?.data?.exists);
    } catch (error) {
      console.error("checkOrganisationSlugExists failed, failing open:", error);
      return true;
    }
  }
);
