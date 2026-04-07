export const prerender = false;

export async function GET({ url }: { url: URL }) {
  const offset = Number(url.searchParams.get("offset") ?? 0);
  const start = offset + 1;
  const end = offset + 5;

  const query = encodeURIComponent(
    `SELECT pl_name,discoverymethod,pl_orbper,pl_dens,pl_eqt,sy_snum,sy_dist,disc_year,pl_rade,pl_masse 
    FROM (
      SELECT ROW_NUMBER() OVER (ORDER BY disc_year DESC) AS rn, 
      pl_name,discoverymethod,pl_orbper,pl_dens,pl_eqt,sy_snum,sy_dist,disc_year,pl_rade,pl_masse 
      FROM ps
      WHERE pl_rade IS NOT NULL
      AND pl_masse IS NOT NULL
      AND pl_eqt IS NOT NULL
    ) 
    WHERE rn BETWEEN ${start} AND ${end}`,
  );

  const API_URL = `https://exoplanetarchive.ipac.caltech.edu/TAP/sync?LANG=ADQL&REQUEST=doQuery&FORMAT=json&QUERY=${query}`;

  const response = await fetch(API_URL);
  const text = await response.text();

  try {
    const data = JSON.parse(text);
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: "API error", raw: text.slice(0, 500) }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
