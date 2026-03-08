async function test() {
  try {
    let token = "";
    try {
      const resp = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "test@test.com",
          password: "password123",
        }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.message);
      token = data.token;
    } catch (err) {
      const resp = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "test user",
          email: "test@test.com",
          password: "password123",
        }),
      });
      const data = await resp.json();
      token = data.token;
    }

    console.log("Logged in!");

    // hit history api
    const historyResp = await fetch("http://localhost:3000/api/users/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movieId: "255661" }),
    });

    const hData = await historyResp.json();
    if (!historyResp.ok) {
      console.log("Error from server:", hData);
    } else {
      console.log("Success:", hData);
    }
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
