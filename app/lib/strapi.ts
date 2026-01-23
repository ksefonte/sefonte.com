export interface SubMenuItem {
  name: string;
  url: string;
}

export interface MenuItem {
  name: string;
  url: string;
  subItems?: SubMenuItem[];
}

// Default to localhost for local development
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

// Fallback menu items for when Strapi is unavailable
const FALLBACK_MENU_ITEMS: MenuItem[] = [
  { name: "Home", url: "/" },
  { name: "About", url: "/about" },
  {
    name: "Projects",
    url: "/projects",
    subItems: [
      { name: "Project A", url: "/projects/project-a" },
      { name: "Project B", url: "/projects/project-b" }
    ]
  }
];

export async function getMenuItems(): Promise<MenuItem[]> {
  // Return fallback if environment variables are not configured
  if (!STRAPI_URL || !STRAPI_TOKEN) {
    console.warn('Strapi environment variables not configured, using fallback menu items');
    return FALLBACK_MENU_ITEMS;
  }

  try {
    const headers: HeadersInit = {};
    if (STRAPI_TOKEN) {
      headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
    }

    const res = await fetch(
      `${STRAPI_URL}/api/menu-items?populate=subItems&sort=order:asc&status=published`,
      {
        headers,
        next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
      }
    );

    if (!res.ok) {
      console.error(`Strapi API error: ${res.status} ${res.statusText}`);
      return FALLBACK_MENU_ITEMS;
    }

    const data = await res.json();
    
    // Handle empty response
    if (!data.data || data.data.length === 0) {
      console.warn('No menu items returned from Strapi, using fallback');
      return FALLBACK_MENU_ITEMS;
    }

    return data.data.map((item: Record<string, unknown>) => ({
      name: item.name as string,
      url: item.url as string,
      subItems: Array.isArray(item.subItems) && item.subItems.length > 0
        ? item.subItems.map((sub: Record<string, unknown>) => ({
            name: sub.name as string,
            url: sub.url as string,
          }))
        : undefined,
    }));
  } catch (error) {
    console.error('Failed to fetch menu items from Strapi:', error);
    return FALLBACK_MENU_ITEMS;
  }
}
