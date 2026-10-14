import { NextResponse } from "next/server";
import { verifyAdminUser, AuthorizationError } from "@/lib/auth/server-auth";
import { getUsuarios, createUsuario } from "@/modules/gestion-usuarios/services/server-usuarios";
import { UsuarioItem } from "@/modules/gestion-usuarios/types/usuario";
import {
  SEDES_CATALOGO,
  APLICACIONES_CATALOGO,
  ROLES_POR_APLICACION,
  ESTADOS_USUARIO,
} from "@/modules/gestion-usuarios/data/usuarios-data";

export async function GET(request: Request) {
  try {
    await verifyAdminUser(request, { requiredAction: "read" });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "No autorizado. Token inválido o ausente." },
      { status: 401 }
    );
  }

  try {
    const usuarios = await getUsuarios();
    return NextResponse.json(usuarios, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener usuarios de Firestore:", error);
    return NextResponse.json(
      { error: "Error interno al obtener usuarios." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await verifyAdminUser(request, { requiredAction: "write" });
  } catch (error: any) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }
    return NextResponse.json(
      { error: "No autorizado. Token inválido o ausente." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    // 1. Validación de campos obligatorios
    if (
      !body.nombre?.trim() ||
      !body.apellidos?.trim() ||
      !body.email?.trim() ||
      !body.documentoIdentificacion?.trim()
    ) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios (nombre, apellidos, email, documentoIdentificacion)." },
        { status: 400 }
      );
    }

    // 2. Validación de formato de correo
    const emailNormalized = body.email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailNormalized)) {
      return NextResponse.json(
        { error: "El formato del correo electrónico es inválido." },
        { status: 400 }
      );
    }

    // 3. Validación de formato de documento (numérico de 5 a 20 dígitos)
    const docClean = body.documentoIdentificacion.trim();
    const docRegex = /^\d{5,20}$/;
    if (!docRegex.test(docClean)) {
      return NextResponse.json(
        { error: "El documento de identificación debe tener entre 5 y 20 dígitos numéricos." },
        { status: 400 }
      );
    }

    // 4. Validación de estado permitido
    const estado = body.estado || "Activo";
    if (!ESTADOS_USUARIO.includes(estado)) {
      return NextResponse.json(
        { error: `El estado del usuario debe ser uno de los permitidos: ${ESTADOS_USUARIO.join(", ")}.` },
        { status: 400 }
      );
    }

    // 5. Validación de sedes y asignaciones
    if (!Array.isArray(body.sedes) || body.sedes.length === 0) {
      return NextResponse.json(
        { error: "El usuario debe tener al menos una sede asignada." },
        { status: 400 }
      );
    }

    for (const sede of body.sedes) {
      const matchedSede = SEDES_CATALOGO.find(
        (s) =>
          s.nombre.toLowerCase() === (sede.sedeNombre || "").trim().toLowerCase() ||
          s.id === sede.sedeId
      );

      if (!matchedSede) {
        return NextResponse.json(
          { error: `La sede "${sede.sedeNombre || sede.sedeId}" no existe en el catálogo institucional.` },
          { status: 400 }
        );
      }

      if (Array.isArray(sede.asignaciones)) {
        for (const asig of sede.asignaciones) {
          const matchedApp = APLICACIONES_CATALOGO.find(
            (a) => a.nombre.toLowerCase() === (asig.aplicacionNombre || "").trim().toLowerCase()
          );

          if (!matchedApp) {
            return NextResponse.json(
              { error: `La aplicación "${asig.aplicacionNombre}" no es válida.` },
              { status: 400 }
            );
          }

          const allowedRoles = ROLES_POR_APLICACION[matchedApp.nombre] || [];
          const isRoleValid = allowedRoles.some(
            (r) => r.toLowerCase() === (asig.rolNombre || "").trim().toLowerCase()
          );

          if (!isRoleValid) {
            return NextResponse.json(
              {
                error: `El rol "${asig.rolNombre}" no es válido para la aplicación "${matchedApp.nombre}".`,
              },
              { status: 400 }
            );
          }
        }
      }
    }

    const payload: Omit<UsuarioItem, "id"> = {
      nombre: body.nombre.trim(),
      apellidos: body.apellidos.trim(),
      tipoDocumento: body.tipoDocumento || "Cédula",
      documentoIdentificacion: docClean,
      identificacion: docClean,
      email: emailNormalized,
      correo: emailNormalized,
      telefono: body.telefono?.trim() || "",
      cargo: body.cargo?.trim() || "",
      estado,
      fechaCreacion:
        body.fechaCreacion ||
        new Date().toLocaleDateString("es-EC", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      sedes: body.sedes,
      avatar: body.avatar || "",
    };

    const newUser = await createUsuario(payload);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.statusCode === 409 || error.code === "EMAIL_ALREADY_EXISTS" || error.code === "DOCUMENT_ALREADY_EXISTS") {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 409 }
      );
    }

    console.error("Error al crear usuario en Firestore:", error);
    return NextResponse.json(
      { error: error.message || "Error al procesar la creación de usuario." },
      { status: 500 }
    );
  }
}
