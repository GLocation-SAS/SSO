import { LoginSSOBackground } from "../components/login-sso-background";
import { LoginSSOForm } from "../components/login-sso-form";

export function LoginSSOView() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center lg:justify-end p-4 lg:p-12 xl:p-24 overflow-hidden bg-background">
      <LoginSSOBackground />
      <LoginSSOForm className="mr-0 lg:mr-12 xl:mr-24 w-full sm:max-w-lg" />
    </main>
  );
}
