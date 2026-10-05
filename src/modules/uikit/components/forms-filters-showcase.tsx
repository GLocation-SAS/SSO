"use client";

import React from "react";
import { SubSection } from "./sub-section";
import { Card } from "@/components/ui/card";
import { TextCursorInput, AlignLeft, CalendarRange, UploadCloud, ListFilter, CircleDot, FormInput, Hash, CheckSquare, ToggleLeft, Calendar, Search } from "lucide-react";

import { InputGroupShowcase } from "./input-group-showcase";
import { TextareaShowcase } from "./textarea-showcase";
import { SearchShowcase } from "./search-showcase";
import { ComboboxShowcase } from "./combobox-showcase";
import { CheckboxShowcase } from "./checkbox-showcase";
import { SwitchShowcase } from "./switch-showcase";
import { CalendarShowcase } from "./calendar-showcase";
import { DateRangeShowcase } from "./date-range-showcase";
import { NumberFieldShowcase } from "./number-field-showcase";
import { FileInputShowcase } from "./file-input-showcase";
import { MultiselectShowcase } from "./multiselect-showcase";
import { RadioButtonShowcase } from "./radio-button-showcase";




export function FormsFiltersShowcase({ registerSection }: { registerSection?: (id: string, el: HTMLElement | null) => void }) {
  return (
    <div className="w-full flex flex-col gap-8 md:gap-12">
        <SubSection
          icon={TextCursorInput} id="text-field"
          registerSection={registerSection}
          title="Campo de texto (Text Field)"
          description="Permite ingresar información de texto en formularios y mostrar estados de validación, ayudas o acciones complementarias."
        >
          <InputGroupShowcase />
        </SubSection>

        <SubSection
          icon={Hash} id="number-field"
          registerSection={registerSection}
          title="Campo numérico (Number Field)"
          description="Permite ingresar valores numéricos y ajustarlos fácilmente mediante controles de incremento o disminución."
        >
          <NumberFieldShowcase />
        </SubSection>

        <SubSection
          icon={AlignLeft} id="textarea"
          registerSection={registerSection}
          title="Área de texto (Textarea)"
          description="Permite ingresar textos más extensos, como observaciones, comentarios o descripciones."
        >
          <TextareaShowcase />
        </SubSection>

        <SubSection
          icon={Search} id="search-field"
          registerSection={registerSection}
          title="Campo de búsqueda (Search Field)"
          description="Permite buscar información dentro del sistema y limpiar rápidamente el término ingresado."
        >
          <SearchShowcase />
        </SubSection>

        <SubSection
          icon={FormInput} id="combobox"
          registerSection={registerSection}
          title="Cuadro combinado (Combobox)"
          description="Permite buscar y seleccionar una opción dentro de una lista, especialmente cuando existen muchas alternativas."
        >
          <ComboboxShowcase />
        </SubSection>

        <SubSection
          icon={ListFilter} id="multiselect"
          registerSection={registerSection}
          title="Selección múltiple (Multiselect)"
          description="Permite seleccionar varias opciones dentro de una misma lista y visualizar las selecciones realizadas."
        >
          <MultiselectShowcase />
        </SubSection>

        <SubSection
          icon={CheckSquare} id="checkbox"
          registerSection={registerSection}
          title="Casilla de verificación (Checkbox)"
          description="Permite seleccionar una o varias opciones independientes dentro de un formulario o configuración."
        >
          <CheckboxShowcase />
        </SubSection>

        <SubSection
          icon={CircleDot} id="radio-button"
          registerSection={registerSection}
          title="Botón de radio (Radio Button)"
          description="Permite seleccionar una única opción entre varias alternativas disponibles."
        >
          <RadioButtonShowcase />
        </SubSection>

        <SubSection
          icon={ToggleLeft} id="switch"
          registerSection={registerSection}
          title="Interruptor (Switch)"
          description="Permite activar o desactivar rápidamente una configuración o funcionalidad."
        >
          <SwitchShowcase />
        </SubSection>

        <SubSection
          icon={Calendar} id="date-picker"
          registerSection={registerSection}
          title="Selector de fecha (Date Picker)"
          description="Permite seleccionar una fecha específica mediante un calendario."
        >
          <CalendarShowcase />
        </SubSection>

        <SubSection
          icon={CalendarRange} id="date-range"
          registerSection={registerSection}
          title="Rango de fechas (Date Range)"
          description="Permite seleccionar un período definido por una fecha de inicio y una fecha de finalización."
        >
          <DateRangeShowcase />
        </SubSection>

        <SubSection
          icon={UploadCloud} id="file-input"
          registerSection={registerSection}
          title="Entrada de archivo (File Input)"
          description="Permite seleccionar o arrastrar archivos para cargarlos al sistema y consultar el estado de la carga."
        >
          <FileInputShowcase />
        </SubSection>
    </div>
  );
}
