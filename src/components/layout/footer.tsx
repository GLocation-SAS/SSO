"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Phone, Globe, Compass, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getAssetPath } from "@/lib/assets";

export const defaultFooterConfig = {
  socials: {
    facebook: { url: "https://www.facebook.com/MinisterioEducacionEcuador", username: "@MinisterioEducacionEcuador", enabled: true },
    instagram: { url: "https://www.instagram.com/ministerioeducacionecuador/", username: "@MinisterioEducacionEcuador", enabled: true },
    x: { url: "https://x.com/Educacion_Ec", username: "@Educacion_Ec", enabled: true },
    tiktok: { url: "https://www.tiktok.com/@educacion_ec", username: "@Educacion_Ec", enabled: true },
    youtube: { url: "https://www.youtube.com/user/MinEducacionEcuador", username: "@MinEducacionEcuador", enabled: true },
    flickr: { url: "https://www.flickr.com/photos/educacionecuador/albums", username: "@educacionecuador", enabled: true },
  },
  contact: {
    address1: "Av. Amazonas N34-451 y Av. Atahualpa",
    address2: "Quito - Ecuador",
    phone: "1800-EDUCACION"
  },
  website: {
    url: "https://www.educacion.gob.ec",
    label: "www.educacion.gob.ec"
  },
  copyright: "© 2026 MINISTERIO DE EDUCACIÓN DEL ECUADOR. TODOS LOS DERECHOS RESERVADOS."
};

export function Footer() {
  const [config, setConfig] = useState(defaultFooterConfig);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'UPDATE_FOOTER' && e.data.payload) {
        setConfig(e.data.payload);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <footer className="relative w-full pt-12 pb-8 bg-surface text-foreground">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative w-full rounded-[32px] border border-border bg-surface/60 pt-12 pb-6 px-8 md:px-12 overflow-hidden shadow-2xl backdrop-blur-md">

          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 pb-8">

            {/* Column 1: Logo & Socials */}
            <div className="flex flex-col items-start justify-center text-left md:border-r md:border-border md:pr-6 h-full">
              <div className="flex flex-col items-start">
                <img
                  src={getAssetPath("/horizontal-light.svg")}
                  alt="MINEDEC Logo"
                  className="h-10 w-auto object-contain block dark:hidden"
                />
                <img
                  src={getAssetPath("/horizontal-dark.svg")}
                  alt="MINEDEC Logo"
                  className="h-10 w-auto object-contain hidden dark:block"
                />
              </div>

              {/* Socials section */}
              <div className="mt-8 flex flex-col items-start">
                <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-4 font-heading">
                  REDES SOCIALES OFICIALES
                </h3>
                <TooltipProvider delayDuration={200}>
                  <div className="flex flex-nowrap items-center justify-start gap-2">
                    {/* Facebook */}
                    {config.socials.facebook.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.facebook.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Facebook: ${config.socials.facebook.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">Facebook</span>
                            <span className="text-[10px] opacity-80">{config.socials.facebook.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Instagram */}
                    {config.socials.instagram.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.instagram.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Instagram: ${config.socials.instagram.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">Instagram</span>
                            <span className="text-[10px] opacity-80">{config.socials.instagram.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* X (Twitter) */}
                    {config.socials.x.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.x.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`X: ${config.socials.x.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l16 16M20 4L4 20" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">X</span>
                            <span className="text-[10px] opacity-80">{config.socials.x.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* TikTok */}
                    {config.socials.tiktok.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.tiktok.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`TikTok: ${config.socials.tiktok.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">TikTok</span>
                            <span className="text-[10px] opacity-80">{config.socials.tiktok.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* YouTube */}
                    {config.socials.youtube.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.youtube.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`YouTube: ${config.socials.youtube.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" /><polygon points="10 15 15 12 10 9" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">YouTube</span>
                            <span className="text-[10px] opacity-80">{config.socials.youtube.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {/* Flickr */}
                    {config.socials.flickr.enabled && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={config.socials.flickr.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="size-9 rounded-full bg-muted/80 border border-border flex items-center justify-center transition-all duration-300 hover:border-primary/50 hover:bg-muted hover:scale-105 active:scale-95 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            aria-label={`Flickr: ${config.socials.flickr.username}`}
                          >
                            <svg className="size-4 text-muted-foreground group-hover:text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="12" r="5" fill="currentColor" /><circle cx="17" cy="12" r="5" fill="currentColor" fillOpacity="0.4" /></svg>
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" variant="primary">
                          <div className="flex flex-col">
                            <span className="font-bold">Flickr</span>
                            <span className="text-[10px] opacity-80">{config.socials.flickr.username}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    )}

                  </div>
                </TooltipProvider>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div className="flex flex-col items-start text-left md:border-r md:border-border md:px-6">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="size-4 text-primary-400" />
                <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest font-heading mt-0.5">
                  NAVEGACIÓN
                </h3>
              </div>
              <ul className="flex flex-col items-start font-sans text-xs sm:text-sm text-muted-foreground gap-3 pl-1">
                <li className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a href="#" className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Inicio</a>
                </li>
                <li className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a href="#" className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Trámites</a>
                </li>
                <li className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a href="#" className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Instituciones</a>
                </li>
                <li className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a href="#" className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Geoportal</a>
                </li>
                <li className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a href="#" className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">Transparencia</a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Links */}
            <div className="flex flex-col items-start text-left md:pl-6">
              {/* CONTACTO */}
              <div className="flex items-center gap-2 mb-4">
                <Phone className="size-4 text-primary-400" />
                <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest font-heading mt-0.5">
                  CONTACTO
                </h3>
              </div>
              <div className="flex flex-col items-start font-sans text-xs sm:text-sm text-muted-foreground gap-5 pl-1 mb-8">
                <div className="flex items-center gap-3">
                  <MapPin className="size-4 text-muted-foreground opacity-60 dark:opacity-100 shrink-0" />
                  <div className="flex flex-col">
                    <span className="whitespace-nowrap">{config.contact.address1}</span>
                    <span className="whitespace-nowrap">{config.contact.address2}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-4 text-muted-foreground opacity-60 dark:opacity-100 shrink-0" />
                  <span>{config.contact.phone}</span>
                </div>
              </div>

              {/* ENLACES OFICIALES */}
              <div className="flex items-center gap-2 mb-4">
                <Globe className="size-4 text-primary-400" />
                <h3 className="text-[10px] font-bold text-primary-400 uppercase tracking-widest font-heading mt-0.5">
                  ENLACES OFICIALES
                </h3>
              </div>
              <div className="flex flex-col items-start font-sans text-xs sm:text-sm text-muted-foreground gap-3 pl-1">
                <div className="flex items-center">
                  <span className="size-1.5 rounded-full bg-muted-foreground opacity-60 dark:opacity-100 inline-block mr-3 shrink-0" />
                  <a
                    href={config.website.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  >
                    {config.website.label}
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Horizontal Divider Line */}
          <div className="relative w-full h-[1px] bg-border my-4">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-primary-500/60 to-transparent blur-[1px]" />
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col items-center justify-center relative z-10 pt-2">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-[10px] text-center text-muted-foreground uppercase tracking-widest font-sans">
              <span>{config.copyright}</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}