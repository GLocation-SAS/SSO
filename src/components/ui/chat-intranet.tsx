import * as React from "react";
import { FileText, Folder, FileSignature, MessageCircle, Lightbulb, Send, Smile, Bot } from "lucide-react";
import { Badge } from "./badge";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";

export function ChatIntranet({ className }: { className?: string } = {}) {
  const [messages, setMessages] = React.useState<{role: 'user' | 'assistant', text: string}[]>([]);
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Agrega mensaje de usuario
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputValue("");
    setIsTyping(true);

    // Simula respuesta de la IA
    setTimeout(() => {
      setIsTyping(false);
      
      const respuestasVariadas = [
        `He revisado tu consulta sobre "${text}". Según nuestros documentos, la información está actualizada en el sistema. ¿Te ayudo con algo más específico?`,
        `¡Excelente pregunta! Referente a "${text}", nuestras políticas indican que todo está en orden. ¿Necesitas que abra el archivo completo?`,
        `Analizando tu petición de "${text}"... Te confirmo que puedes encontrar los formatos relacionados directamente en tu panel de descargas.`,
        `Entendido. He procesado la información sobre "${text}". Todo cuadra perfectamente con las normativas actuales de la intranet.`
      ];
      
      const respuestaAleatoria = respuestasVariadas[Math.floor(Math.random() * respuestasVariadas.length)];
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: respuestaAleatoria
      }]);
    }, 1500);
  };

  return (
    <div className={`flex flex-col bg-background rounded-xl border border-border shadow-md overflow-hidden w-full h-full min-h-[600px] ${className || ""}`}>
      
      {/* Premium Header */}
      <div className="px-6 py-4 relative bg-surface border-b border-border flex items-center justify-between sticky top-0 z-20 shadow-xs">
        {/* Gradient Border Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/60 via-info/40 to-transparent"></div>

        <div className="flex items-center gap-3 relative z-10">
            <Avatar className="size-8 sm:size-10 shadow-xs border border-primary/20 bg-primary/10">
              <AvatarFallback className="text-primary font-bold text-xs !bg-transparent">
                <Bot className="size-4 sm:size-5 text-primary" />
              </AvatarFallback>
            </Avatar>
          <div className="flex flex-col text-left">
            <h3 className="font-semibold text-foreground text-sm tracking-wide leading-none">Asistente MINEDEC IA</h3>
            <span className="text-[10px] text-success font-medium flex items-center gap-1 mt-1">
              <span className="size-1.5 rounded-full bg-success animate-pulse inline-block" />
              En línea
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge tone="neutral" appearance="soft" size="sm" className="h-5 px-1.5 text-[9px] font-extrabold text-muted-foreground border-border bg-muted">V2.4</Badge>
        </div>
      </div>

      {/* Main Content Area */}
      <div className={`flex-1 p-4 sm:p-6 flex flex-col relative ${messages.length > 0 ? "overflow-y-auto scrollbar-thin" : "overflow-hidden"}`}>
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>

            {/* Top Graphic Section: AI Symbol + Floating Docs */}
            <div className="relative w-full max-w-sm flex items-center justify-center mb-6 mt-2">
              
              {/* Floating Elements */}
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -left-6 top-2 animate-bounce duration-[4s]">
                  <div className="p-2.5 bg-surface rounded-2xl shadow-md border border-border/80 rotate-[-12deg]">
                    <FileText className="size-5 text-primary" />
                  </div>
                </div>
                
                <div className="absolute -right-4 top-0 animate-bounce duration-[5s]">
                  <div className="p-2.5 bg-surface rounded-2xl shadow-md border border-border/80 rotate-[15deg]">
                    <Folder className="size-5 text-info" />
                  </div>
                </div>

                <div className="absolute right-6 bottom-2 animate-bounce duration-[3.5s]">
                  <div className="p-2 bg-surface rounded-xl shadow-md border border-border/80 rotate-[-8deg]">
                    <FileSignature className="size-4.5 text-warning" />
                  </div>
                </div>
              </div>

              {/* Central AI Avatar */}
              <div className="relative z-10 size-24 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center shadow-lg backdrop-blur-md animate-in zoom-in-95 duration-700">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-md"></div>
                <MessageCircle className="size-10 text-primary relative z-10 animate-pulse" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="text-center space-y-2 sm:space-y-3 relative z-10 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
                <h2 className="text-xl font-bold text-foreground mt-4 text-center tracking-tight">¡Bienvenido al chat!</h2>
              
              {/* Features Badges */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-3 sm:pt-6 mt-1 sm:mt-4 border-t border-border/40 w-full px-1 sm:px-4">
                <Badge tone="primary" appearance="soft" className="px-3 py-1.5 flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider shadow-sm rounded-full whitespace-nowrap">
                  <MessageCircle className="size-3.5 shrink-0" />
                  <span>Responde tus preguntas</span>
                </Badge>
                <Badge tone="info" appearance="soft" className="px-3 py-1.5 flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider shadow-sm rounded-full whitespace-nowrap">
                  <FileText className="size-3.5 shrink-0" />
                  <span>Resume y analiza</span>
                </Badge>
                <Badge tone="warning" appearance="soft" className="px-3 py-1.5 flex items-center gap-1.5 font-semibold text-[10px] uppercase tracking-wider shadow-sm rounded-full whitespace-nowrap">
                  <Lightbulb className="size-3.5 shrink-0" />
                  <span>Extrae lo importante</span>
                </Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 flex-1 w-full pb-4">
            {messages.map((msg, i) => (
              msg.role === 'assistant' ? (
                <div key={i} className="flex items-start gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                  <div className="mt-1 flex size-12 shrink-0 items-center justify-center rounded-full border border-primary/20 shadow-sm overflow-hidden bg-primary/10">
                    <Avatar className="size-full shrink-0">
                      <AvatarFallback className="text-sm font-bold text-primary !bg-transparent">
                        <Bot className="size-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-surface border border-border/40 p-4 text-sm text-foreground shadow-sm leading-relaxed text-left">
                    {msg.text && msg.text.split('\n').map((line, j) => (
                      <React.Fragment key={j}>
                        {line}
                        {j < msg.text.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex flex-col items-end gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-primary text-primary-foreground p-4 text-sm shadow-md leading-relaxed border border-primary-600/25">
                    {msg.text}
                  </div>
                </div>
              )
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary/40 shadow-sm overflow-hidden bg-primary/10 animate-pulse ring-4 ring-primary/10">
                  <Avatar className="size-6 sm:size-8 mt-1 shrink-0 shadow-xs border border-primary/20 bg-primary/10">
                    <AvatarFallback className="text-[10px] font-bold text-primary !bg-transparent">
                      <Bot className="size-3.5 sm:size-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="rounded-2xl rounded-tl-none bg-surface border border-border/40 px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                  <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="size-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Input Area */}
      <div className="p-3 sm:p-6 shrink-0 w-full bg-background/50 backdrop-blur-sm">
        <div className="relative w-full rounded-[1.5rem] p-[1.5px] overflow-hidden group shadow-lg">
          {/* Animated gradient background for border */}
          <div className="absolute top-1/2 left-1/2 w-[200%] h-[500%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,var(--primary)_25%,var(--info)_50%,transparent_75%)] animate-spin [animation-duration:60s] opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Inner content */}
          <div className="relative bg-surface rounded-[calc(1.5rem-1.5px)] w-full h-full flex flex-col p-4 gap-2">
            <textarea
              placeholder="Escribe tu consulta..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              rows={3}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none outline-none border-0 focus:ring-0 focus:outline-none focus:border-0"
            />
            <div className="flex justify-between items-center mt-2">
              <Smile className="text-muted-foreground hover:text-foreground cursor-pointer size-5" />
              <Button
                size="icon"
                onClick={() => handleSend(inputValue)}
                className="bg-primary hover:bg-primary-600 text-white rounded-xl h-10 w-10 border-0 shadow-sm"
              >
                <Send className="size-4" fill="currentColor" />
              </Button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
