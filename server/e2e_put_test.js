(async () => {
  const fetch = global.fetch || (await import("node-fetch")).default;
  const base = "http://localhost:5000/api";
  const loginRes = await fetch(base + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "testuser@example.com",
      password: "Password123",
    }),
  });
  const login = await loginRes.json();
  console.log("login", loginRes.status, login.token ? "got token" : login);
  const token = login.token;
  const url = base + "/cart/69fb71315163f4434591f831";
  const put = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ quantity: 1 }),
  });
  const putBody = await put.text();
  console.log("PUT", put.status, putBody);
})();
