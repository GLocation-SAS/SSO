import { LoginSSOBackground } from "../components/login-sso-background";
import { LoginSSOForm } from "../components/login-sso-form";

export function LoginSSOView() {
  return (
    <main className="relative flex min-h-screen lg:h-screen w-full items-center justify-center lg:justify-end p-4 lg:px-10 lg:py-6 xl:px-20 xl:py-8 overflow-hidden bg-background">
      <LoginSSOBackground />
      <LoginSSOForm className="mr-0 lg:mr-4 xl:mr-12 w-full sm:max-w-md lg:max-w-[480px] max-h-[calc(100vh-2rem)] overflow-y-auto" />
    </main>
  );
}
