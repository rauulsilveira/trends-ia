import { authenticateFacebookUser } from "./mockFacebookAuth.js";

async function test() {
  const user = await authenticateFacebookUser("fake-token-123");
  console.log("Usuário retornado:", user);
}

test()
  .catch(console.error)
  .finally(() => process.exit());
