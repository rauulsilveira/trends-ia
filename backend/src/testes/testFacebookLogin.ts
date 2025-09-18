// src/testFacebookLogin.ts
//import { authenticateFacebookUser } from "./facebookAuth.js";
import { authenticateFacebookUser } from "../mockFacebookAuth.js";
async function testFacebookLogin() {
  try {
    const fbToken = "EAAIJunHvRZBcBPWzN62UCb6am4L8VAQzH3c7IrI59UT2m2j2tOhVNbpr8z9dnuLesW8FwHPYm9w6WcHZA36lIzccIb4WMyTsRPcWaGDdCIsTHqglG7KaBeJLjdPO0tMZBHMZCyZAqo9oZBZCIumFRsptxJh8mBl0pl5U3vzymxXrSUZAJz0mcyGhOFFAl20jGbrXGUNTSJqCeIJCDBHfX1qAASEIJxwnFk4vsc48";
    
    const user = await authenticateFacebookUser(fbToken);

    console.log("✅ Usuário autenticado com sucesso:");
    console.log(user);
  } catch (err) {
    console.error("❌ Erro ao autenticar usuário:", err);
  }
}

testFacebookLogin();
