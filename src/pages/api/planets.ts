export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const limit = 5;
  const lastYear = url.searchParams.get("lastYear") || "3000";

  const query = `
    SELECT TOP ${offset + limit} 
    pl_name, discoverymethod, pl_orbper, pl_dens, pl_eqt, sy_snum, sy_dist, disc_year, pl_rade, pl_masse
    FROM ps
    WHERE pl_rade IS NOT NULL 
      AND pl_masse IS NOT NULL 
      AND pl_eqt IS NOT NULL
    ORDER BY disc_year DESC
  `.trim();

  const API_URL = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?QUERY=${encodeURIComponent(query)}&FORMAT=json&LANG=ADQL`;

  try {
    const response = await fetch(API_URL);
    const text = await response.text();

    if (!response.ok) {
      console.error("NASA respondió error:", text);
      return new Response(
        JSON.stringify({ error: "NASA Error", details: text }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const data = JSON.parse(text);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    console.error("Error en Proxy:", e.message);
    return new Response(
      JSON.stringify({ error: "Proxy Exception", message: e.message }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
