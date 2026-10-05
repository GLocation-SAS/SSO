import { UIKitView } from "@/modules/uikit/views/uikit-view";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MINEDEC KIT UX / UI | MINEDEC",
  description: "Explora los componentes y tokens del sistema de diseño de MINEDEC.",
};

export default function UIKitPage() {
  return <UIKitView />;
}
