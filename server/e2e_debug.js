(async () => {
  const fetch = global.fetch || (await import("node-fetch")).default;
  const base = "http://localhost:5000/api";
  const h = { "Content-Type": "application/json" };

  const email = "e2e+" + Date.now() + "@example.com";
  const registerRes = await fetch(base + "/auth/register", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ name: "E2E Debug", email, password: "Password123" }),
  });
  const register = await registerRes.json();
  console.log("REGISTER", registerRes.status, register._id);

  const loginRes = await fetch(base + "/auth/login", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ email, password: "Password123" }),
  });
  const login = await loginRes.json();
  const token = login.token;
  console.log("LOGIN", loginRes.status, token ? "token ok" : login);

  const products = await (await fetch(base + "/products")).json();
  const prod = products[0];
  console.log("PRODUCT", prod._id);

  const addRes = await fetch(base + "/cart", {
    method: "POST",
    headers: { ...h, Authorization: "Bearer " + token },
    body: JSON.stringify({ productId: prod._id, quantity: 2 }),
  });
  const add = await addRes.json();
  console.log("ADD", addRes.status, JSON.stringify(add, null, 2));

  const cartNow = await (
    await fetch(base + "/cart", {
      headers: { Authorization: "Bearer " + token },
    })
  ).json();
  console.log("CART AFTER ADD", JSON.stringify(cartNow, null, 2));

  const putRes = await fetch(base + "/cart/" + prod._id, {
    method: "PUT",
    headers: { ...h, Authorization: "Bearer " + token },
    body: JSON.stringify({ quantity: 1 }),
  });
  const putBody = await putRes.text();
  console.log("PUT", putRes.status, putBody);
})();
