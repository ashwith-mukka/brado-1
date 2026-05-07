(async () => {
  const fetch = global.fetch || (await import("node-fetch")).default;
  const base = "http://localhost:5000/api";
  const h = { "Content-Type": "application/json" };

  const email = "e2e+" + Date.now() + "@example.com";
  const registerRes = await fetch(base + "/auth/register", {
    method: "POST",
    headers: h,
    body: JSON.stringify({ name: "E2E Full", email, password: "Password123" }),
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
    body: JSON.stringify({ productId: prod._id, quantity: 3 }),
  });
  const add = await addRes.json();
  console.log(
    "ADD",
    addRes.status,
    JSON.stringify(
      add.items.map((i) => ({ product: i.product._id, qty: i.quantity })),
      null,
      2,
    ),
  );

  const put1Res = await fetch(base + "/cart/" + prod._id, {
    method: "PUT",
    headers: { ...h, Authorization: "Bearer " + token },
    body: JSON.stringify({ quantity: 2 }),
  });
  const put1 = await put1Res.json();
  console.log(
    "PUT->2",
    put1Res.status,
    JSON.stringify(
      put1.items.map((i) => ({ product: i.product._id, qty: i.quantity })),
      null,
      2,
    ),
  );

  const put0Res = await fetch(base + "/cart/" + prod._id, {
    method: "PUT",
    headers: { ...h, Authorization: "Bearer " + token },
    body: JSON.stringify({ quantity: 0 }),
  });
  const put0 = await put0Res.json();
  console.log(
    "PUT->0",
    put0Res.status,
    JSON.stringify(put0.items || [], null, 2),
  );

  const cartNow = await (
    await fetch(base + "/cart", {
      headers: { Authorization: "Bearer " + token },
    })
  ).json();
  console.log("CART FINAL", JSON.stringify(cartNow.items || [], null, 2));
})();
