"use client";

import React from 'react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from '@/components/ui/link';
import { 
  Palette, 
  Component, 
  LayoutTemplate, 
  Accessibility, 
  ArrowLeft,
  Lock,
  ArrowRight,
  Info,
  Mail,
  Paintbrush,
  Layers,
  Eye,
  EyeOff
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { CapacityCard } from '@/components/ui/capacity-card';
import { InputGroup, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';

export default function DesignSystemLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailState, setEmailState] = React.useState<'default' | 'success' | 'error'>('default');
  const [hasErrored, setHasErrored] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  
  const isFormValid = email.trim() !== '' && password.trim() !== '';

  React.useEffect(() => {
    if (!email) {
      setEmailState('default');
      setHasErrored(false);
      return;
    }

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (isValid) {
      setEmailState(hasErrored ? 'success' : 'default');
    } else {
      if (hasErrored) {
        setEmailState('error');
      } else {
        const timer = setTimeout(() => {
          setEmailState('error');
          setHasErrored(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [email, hasErrored]);

  const handleBlur = () => {
    if (!email) return;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setEmailState('error');
      setHasErrored(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = '/uikit?login=success';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-0 sm:p-8 lg:p-12 relative overflow-hidden bg-background">
      
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 bg-background/20 backdrop-blur-sm sm:backdrop-blur-none sm:bg-transparent" />

      {/* Main Container */}
      <div className="w-full max-w-[1400px] h-[100dvh] sm:h-[85vh] sm:max-h-[840px] sm:min-h-[700px] bg-background/70 backdrop-blur-xl sm:rounded-[2rem] sm:shadow-2xl sm:border border-border/60 flex overflow-hidden z-10 relative">
        
        <div className="hidden lg:flex w-[50%] relative flex-col border-r border-border p-10 xl:p-14 bg-surface/30 justify-center items-center">
          
          <div className="w-full max-w-xl flex flex-col">
            <div className="flex flex-col mb-10 xl:mb-14">
              {/* Header Text */}
              <div>
                <Badge appearance="outline" tone="primary" className="mb-6 bg-background border-primary/20 text-primary gap-1.5 px-3 py-1 font-semibold tracking-wide uppercase text-xs shadow-sm">
                  <Paintbrush className="size-4" />
                  Recursos de Diseño
                </Badge>
                <h1 className="font-heading font-bold text-4xl xl:text-5xl text-foreground leading-[1.1] tracking-tight mb-5">
                  Design System <br/><span className="text-primary">MINEDEC</span>
                </h1>
                <p className="text-muted-foreground text-base xl:text-lg leading-relaxed">
                  Sistema de diseño institucional para construir interfaces consistentes, accesibles y reutilizables.
                </p>
              </div>
            </div>

            {/* Cards of benefits */}
            <div className="grid grid-cols-2 gap-3">
              <CapacityCard 
                title="Componentes"
                description="Bloques de construcción listos para usar en tus proyectos."
                icon={Component}
                color="primary"
              />
              <CapacityCard 
                title="Fundamentos y estilos"
                description="Colores, tipografías, sombras y espaciados estandarizados."
                icon={Palette}
                color="success"
              />
              <CapacityCard 
                title="Patrones consistentes"
                description="Composiciones y flujos visuales para una mejor UX."
                icon={LayoutTemplate}
                color="info"
              />
              <CapacityCard 
                title="Accesibilidad"
                description="Interfaces diseñadas para que todos puedan interactuar con ellas."
                icon={Accessibility}
                color="warning"
              />
            </div>
          </div>
        </div>

        {/* ─── LADO DERECHO: Acceso Formulario ─── */}
        <div className="w-full lg:w-[50%] flex flex-col sm:bg-transparent relative overflow-hidden">
          
          <div className="flex-1 bg-background sm:rounded-none sm:mt-0 relative z-20 px-6 py-6 sm:p-8 xl:p-14 flex flex-col justify-between overflow-y-auto">
          
            {/* Top Bar */}
            <div className="w-full flex items-center justify-end mb-8">
              <div className="flex items-center gap-2 z-50">
                <ThemeToggle />
              </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[480px] mx-auto flex flex-col items-center justify-start flex-1 pt-6 sm:pt-4 pb-4">
              <Card 
                className="capacity-card w-full shadow-sm border-border/80 hover:border-transparent px-3 py-6 sm:px-6 sm:py-5 flex flex-col items-center text-center relative transition-all duration-500 sm:-mt-8"
                style={{ 
                  '--card-accent': 'var(--color-primary-500)', 
                  '--card-glow': 'rgba(var(--primitive-primary-500), 0.18)' 
                } as React.CSSProperties}
              >
                
                <div className="mb-4 flex flex-col items-center justify-center">
                    <div className="flex items-center justify-center mb-4">
                      <img src="/vertical-light.svg" alt="Logo MINEDEC" className="h-14 w-auto dark:hidden object-contain" />
                      <img src="/vertical-dark.svg" alt="Logo MINEDEC" className="h-14 w-auto hidden dark:block object-contain" />
                    </div>
                  <h3 className="font-heading font-bold text-xl text-primary dark:text-foreground text-center">Acceso al Design System</h3>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4 relative z-10 w-full">
                  <div className="flex flex-col gap-2 text-left">
                    <label className="text-sm font-medium text-foreground">Correo electrónico</label>
                    <InputGroup state={emailState} leftIcon={<Mail className="size-4" />}>
                      <InputGroupInput 
                        type="email" 
                        placeholder="ejemplo@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleBlur}
                        required
                      />
                    </InputGroup>
                    {emailState === 'error' && (
                      <p className="text-xs text-danger font-medium mt-1 animate-in fade-in slide-in-from-top-1">
                        Ingresa un correo electrónico válido.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 text-left">
                    <label className="text-sm font-medium text-foreground">Contraseña</label>
                    <InputGroup leftIcon={<Lock className="size-4" />}>
                      <InputGroupInput 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <InputGroupButton type="button" size="icon-sm" className="h-8 w-8 shrink-0" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </InputGroupButton>
                    </InputGroup>
                  </div>

                  <div className="flex flex-col gap-3 mt-3 w-full">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="w-full block" tabIndex={!isFormValid ? 0 : -1}>
                              <Button 
                                variant="primary" 
                                type="submit"
                                className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold"
                                disabled={!isFormValid}
                              >
                                Ingresar al UI Kit
                              </Button>
                            </span>
                          </TooltipTrigger>
                          {!isFormValid && (
                            <TooltipContent variant="info" side="top" sideOffset={10}>
                              Faltan campos por completar
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>

                    <div className="relative flex items-center justify-center -my-1 w-full">
                      <div className="w-16 border-t border-border/60"></div>
                      <span className="flex-shrink-0 mx-3 text-xs text-muted-foreground font-medium">o</span>
                      <div className="w-16 border-t border-border/60"></div>
                    </div>

                    <Button 
                      variant="neutral" 
                      type="button"
                      className="w-full h-12 bg-surface rounded-xl flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold"
                      onClick={() => toast.info("Función no disponible", { description: "Por ahora solo se permite el ingreso con usuario y contraseña, ya que es una versión demo." })}
                    >
                      <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Iniciar sesión con Google</span>
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
            
            {/* Footer */}
            <div className="w-full flex items-end justify-between mt-auto pt-4">
              <div className="text-left text-xs text-muted-foreground/70 flex flex-col gap-1">
                <p>&copy; {new Date().getFullYear()} Ministerio de Educación.</p>
                <p>Design System UI Kit.</p>
              </div>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="size-10 rounded-full shrink-0" aria-label="Información de acceso">
                      <Info className="size-5 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent variant="info" side="top" align="end" className="max-w-[280px] p-4 flex flex-col gap-1 text-left items-start" sideOffset={12}>
                    <p className="font-heading font-bold text-base text-info-foreground text-left w-full">Plataforma interna</p>
                    <p className="text-info-foreground/80 text-xs leading-relaxed text-left w-full">El acceso al UI Kit y sistema de diseño está restringido al equipo de desarrollo y diseño institucional.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
