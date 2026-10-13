export interface BackgroundImagesConfig {
  mobileLight?: string;
  mobileDark?: string;
  desktopLight?: string;
  desktopDark?: string;
}

export interface LoginAuthConfig {
  title?: string;
  subtitle?: string;
  description?: string;
  targetApp?: string;
  redirectTo?: string;
  backgroundImages?: BackgroundImagesConfig;
  className?: string;
  mfaRedirectTo?: string;
  mfaSendOtpUrl?: string;
}
