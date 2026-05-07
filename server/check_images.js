(async () => {
  const base = "http://localhost:5000/api";
  const fetchApi = global.fetch || (await import("node-fetch")).default;
  const stopWords = new Set([
    "the",
    "and",
    "with",
    "for",
    "pro",
    "series",
    "max",
    "ultra",
    "plus",
    "m3",
    "m2",
    "m4",
    "air",
    "watch",
    "apple",
    "samsung",
    "google",
  ]);

  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, " ");
  const tokensFrom = (name) =>
    normalize(name)
      .split(/\s+/)
      .filter((t) => t && t.length >= 3 && !stopWords.has(t));

  try {
    const res = await fetchApi(base + "/products");
    const products = await res.json();

    const results = [];
    for (const p of products) {
      const img = p.image;
      let ok = false,
        contentType = null,
        size = null,
        status = null;
      try {
        const head = await fetchApi(img, { method: "HEAD" });
        status = head.status;
        contentType = head.headers.get("content-type");
        size = head.headers.get("content-length");
        ok = status >= 200 && status < 300;
      } catch (e) {
        try {
          // fallback to GET small request
          const g = await fetchApi(img, { method: "GET" });
          status = g.status;
          contentType = g.headers.get("content-type");
          size = g.headers.get("content-length");
          ok = status >= 200 && status < 300;
        } catch (err) {
          ok = false;
        }
      }

      const tokens = tokensFrom(p.name);
      const matched = [];
      for (const t of tokens) {
        if (img.toLowerCase().includes(t)) matched.push(t);
      }

      results.push({
        name: p.name,
        image: img,
        accessible: ok,
        status,
        contentType,
        size,
        tokens,
        matchedTokens: matched,
        heuristicMatch: matched.length > 0,
      });
    }

    console.log(JSON.stringify(results, null, 2));
    const okCount = results.filter((r) => r.accessible).length;
    const hmCount = results.filter((r) => r.heuristicMatch).length;
    console.log(
      "\nSummary:",
      okCount,
      "images accessible,",
      hmCount,
      "heuristic keyword matches.",
    );
  } catch (e) {
    console.error("Error", e);
    process.exit(1);
  }
})();
