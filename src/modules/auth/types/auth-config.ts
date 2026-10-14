export interface BackgroundImagesConfig {
  mobileLight?: string;
  mobileDark?: string;
  desktopLight?: string;
  desktopDark?: string;
  desktopPosition?: string;
  mobilePosition?: string;
}

export const DEFAULT_NOTAS_BACKGROUND_IMAGES: BackgroundImagesConfig = {
  desktopLight: "/fondo-notas.png",
  desktopDark: "/fondo-notas.png",
  mobileLight: "/fondo-mobile-notas.png",
  mobileDark: "/fondo-mobile-notas.png",
  desktopPosition: "object-left-top",
  mobilePosition: "object-top",
};

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
