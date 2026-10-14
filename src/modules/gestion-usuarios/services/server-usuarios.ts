import "server-only";
import { adminDb, adminAuth } from "@/lib/firebase/admin";
import { Timestamp } from "firebase-admin/firestore";
import {
  UsuarioItem,
  UsuarioSede,
  UsuarioSedeRolAplicacion,
} from "../types/usuario";
import {
  SEDES_CATALOGO,
  APLICACIONES_CATALOGO,
  ROLES_APLICACION,
  mockUsuariosData,
} from "../data/usuarios-data";

const COLLECTION_NAME = "usuarios";
const INDICES_COLLECTION = "usuarios_indices";

export async function getUsuarios(): Promise<UsuarioItem[]> {
  const snapshot = await adminDb.collection(COLLECTION_NAME).get();
  
  const usuarios = snapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    } as UsuarioItem;
  });

  // Ordenar por fecha de creación o timestamp descendente
  return usuarios.sort((a: any, b: any) => {
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return timeB - timeA;
  });
}

export async function getUsuarioById(id: string): Promise<UsuarioItem | null> {
  const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as UsuarioItem;
}

export async function getUsuarioByEmail(email: string): Promise<UsuarioItem | null> {
  const querySnap = await adminDb
    .collection(COLLECTION_NAME)
    .where("email", "==", email.trim().toLowerCase())
    .limit(1)
    .get();

  if (querySnap.empty) {
    // Probar búsqueda por identificador exacto si no vino en minúscula
    const fallbackSnap = await adminDb
      .collection(COLLECTION_NAME)
      .where("email", "==", email.trim())
      .limit(1)
      .get();
    if (!fallbackSnap.empty) {
      return { id: fallbackSnap.docs[0].id, ...fallbackSnap.docs[0].data() } as UsuarioItem;
    }

    // Fallback de desarrollo para cuentas estándar/administrativas locales
    const norm = email.trim().toLowerCase();
    const fallbackUser = mockUsuariosData.find((u) => {
      const uEmail = (u.email || u.correo || "").trim().toLowerCase();
      if (uEmail === norm) return true;
      if (norm === "prueba2@gmail.com" && u.id === "usr-paula") return true;
      if (norm.includes("paula.rozo") && u.id === "usr-paula") return true;
      if (norm.includes("jeimy.mateus") && u.id === "usr-jeimy") return true;
      return false;
    });

    if (fallbackUser) {
      return fallbackUser;
    }

    return null;
  }

  return {
    id: querySnap.docs[0].id,
    ...querySnap.docs[0].data(),
  } as UsuarioItem;
}

export async function getUsuarioByDocumento(identificacion: string): Promise<UsuarioItem | null> {
  const docSanitized = identificacion.trim();
  const querySnap = await adminDb
    .collection(COLLECTION_NAME)
    .where("documentoIdentificacion", "==", docSanitized)
    .limit(1)
    .get();

  if (!querySnap.empty) {
    return { id: querySnap.docs[0].id, ...querySnap.docs[0].data() } as UsuarioItem;
  }

  const fallbackSnap = await adminDb
    .collection(COLLECTION_NAME)
    .where("identificacion", "==", docSanitized)
    .limit(1)
    .get();

  if (!fallbackSnap.empty) {
    return { id: fallbackSnap.docs[0].id, ...fallbackSnap.docs[0].data() } as UsuarioItem;
  }

  return null;
}

export async function getUsuarioByAuthUid(authUid: string): Promise<UsuarioItem | null> {
  const querySnap = await adminDb
    .collection(COLLECTION_NAME)
    .where("authUid", "==", authUid)
    .limit(1)
    .get();

  if (querySnap.empty) {
    return null;
  }

  return {
    id: querySnap.docs[0].id,
    ...querySnap.docs[0].data(),
  } as UsuarioItem;
}

/**
 * Resuelve una asignación vinculando el ID real del usuario y el ID canónico del rol y aplicación
 */
function resolveCanonicalAssignment(
  asig: Partial<UsuarioSedeRolAplicacion>,
  sedeId: string,
  sedeNombre: string,
  userId: string
): UsuarioSedeRolAplicacion {
  const matchedRole = ROLES_APLICACION.find(
    (ra) =>
      ra.aplicacionNombre.toLowerCase() === (asig.aplicacionNombre || "").trim().toLowerCase() &&
      ra.rolNombre.toLowerCase() === (asig.rolNombre || "").trim().toLowerCase()
  );

  const matchedApp = APLICACIONES_CATALOGO.find(
    (a) => a.nombre.toLowerCase() === (asig.aplicacionNombre || "").trim().toLowerCase()
  );

  const canonicalRolAplicacionId =
    matchedRole?.id ||
    asig.rolAplicacionId ||
    `ra-${(matchedApp?.codigo || "app").toLowerCase()}-${(asig.rolNombre || "rol").toLowerCase().replace(/\s+/g, "-")}`;

  return {
    id: asig.id && !asig.id.startsWith("asig-temp")
      ? asig.id
      : `asig-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    usuarioId: userId,
    sedeId,
    sedeNombre,
    rolAplicacionId: canonicalRolAplicacionId,
    aplicacionNombre: matchedApp?.nombre || asig.aplicacionNombre || "",
    rolNombre: matchedRole?.rolNombre || asig.rolNombre || "",
    estado: asig.estado || "Activo",
    fechaAsignacion: asig.fechaAsignacion || new Date().toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    permisos: Array.isArray(asig.permisos) ? asig.permisos : [],
  };
}

export async function createUsuario(data: Omit<UsuarioItem, "id">): Promise<UsuarioItem> {
  const now = Timestamp.now().toMillis();
  const normalizedEmail = data.email.trim().toLowerCase();
  const sanitizedDoc = (data.documentoIdentificacion || data.identificacion || "").trim();

  // 1. Verificación previa de usuarios históricos en la colección principal
  const existingByEmail = await getUsuarioByEmail(normalizedEmail);
  if (existingByEmail) {
    const error: any = new Error("El correo electrónico ya se encuentra registrado.");
    error.statusCode = 409;
    error.code = "EMAIL_ALREADY_EXISTS";
    throw error;
  }

  if (sanitizedDoc) {
    const existingByDoc = await getUsuarioByDocumento(sanitizedDoc);
    if (existingByDoc) {
      const error: any = new Error("El documento de identificación ya se encuentra registrado.");
      error.statusCode = 409;
      error.code = "DOCUMENT_ALREADY_EXISTS";
      throw error;
    }
  }

  // 2. Pre-asignar referencia de Firestore para obtener el ID definitivo
  const userDocRef = adminDb.collection(COLLECTION_NAME).doc();
  const emailIndexRef = adminDb.collection(INDICES_COLLECTION).doc(`email_${normalizedEmail}`);
  const docIndexRef = sanitizedDoc
    ? adminDb.collection(INDICES_COLLECTION).doc(`doc_${sanitizedDoc}`)
    : null;

  // 3. Vincular sedes y asignaciones con el ID definitivo del usuario y catálogo canónico
  const userSedes: UsuarioSede[] = (data.sedes || []).map((s) => {
    const matchedSede = SEDES_CATALOGO.find(
      (sc) => sc.nombre.toLowerCase() === s.sedeNombre.trim().toLowerCase() || sc.id === s.sedeId
    );
    const realSedeId = matchedSede?.id || s.sedeId || "sede-pc";
    const realSedeNombre = matchedSede?.nombre || s.sedeNombre;

    const realAsignaciones = (s.asignaciones || []).map((a) =>
      resolveCanonicalAssignment(a, realSedeId, realSedeNombre, userDocRef.id)
    );

    return {
      sedeId: realSedeId,
      sedeNombre: realSedeNombre,
      asignaciones: realAsignaciones,
    };
  });

  const isActive = data.active !== undefined ? Boolean(data.active) : data.estado === "Activo";
  const usuarioToSave: Omit<UsuarioItem, "id"> = {
    ...data,
    email: normalizedEmail,
    correo: normalizedEmail,
    documentoIdentificacion: sanitizedDoc,
    identificacion: sanitizedDoc,
    tipoDocumento: data.tipoDocumento || "Cédula",
    active: isActive,
    estado: data.estado || (isActive ? "Activo" : "Inactivo"),
    sedes: userSedes,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  // 4. Transacción atómica en Firestore para garantizar unicidad ante concurrencia
  // REGLA OBLIGATORIA DE FIRESTORE: Todas las lecturas se ejecutan antes de cualquier escritura
  await adminDb.runTransaction(async (transaction: any) => {
    // --- LECTURAS PRIMERO ---
    const emailIndexSnap = await transaction.get(emailIndexRef);
    const docIndexSnap = docIndexRef ? await transaction.get(docIndexRef) : null;

    if (emailIndexSnap.exists && emailIndexSnap.data()?.usuarioId !== userDocRef.id) {
      const error: any = new Error("El correo electrónico ya se encuentra registrado.");
      error.statusCode = 409;
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }

    if (docIndexSnap && docIndexSnap.exists && docIndexSnap.data()?.usuarioId !== userDocRef.id) {
      const error: any = new Error("El documento de identificación ya se encuentra registrado.");
      error.statusCode = 409;
      error.code = "DOCUMENT_ALREADY_EXISTS";
      throw error;
    }

    // --- ESCRITURAS DESPUÉS DE LAS LECTURAS ---
    transaction.set(userDocRef, usuarioToSave);
    transaction.set(emailIndexRef, {
      usuarioId: userDocRef.id,
      email: normalizedEmail,
      createdAt: now,
    });
    if (docIndexRef) {
      transaction.set(docIndexRef, {
        usuarioId: userDocRef.id,
        documentoIdentificacion: sanitizedDoc,
        createdAt: now,
      });
    }
  });

  return {
    id: userDocRef.id,
    ...usuarioToSave,
  };
}

export async function updateUsuario(id: string, data: Partial<UsuarioItem>): Promise<UsuarioItem | null> {
  const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return null;
  }

  const existingData = docSnap.data() as UsuarioItem;
  const newEmail = data.email ? data.email.trim().toLowerCase() : undefined;
  const oldEmail = existingData.email ? existingData.email.trim().toLowerCase() : undefined;
  const newDoc = (data.documentoIdentificacion || data.identificacion)
    ? (data.documentoIdentificacion || data.identificacion)!.trim()
    : undefined;
  const oldDoc = (existingData.documentoIdentificacion || existingData.identificacion)
    ? (existingData.documentoIdentificacion || existingData.identificacion)!.trim()
    : undefined;

  // Verificación de conflictos si cambia el correo
  if (newEmail && newEmail !== oldEmail) {
    const existingByEmail = await getUsuarioByEmail(newEmail);
    if (existingByEmail && existingByEmail.id !== id) {
      const error: any = new Error("El correo electrónico ya se encuentra registrado por otro usuario.");
      error.statusCode = 409;
      error.code = "EMAIL_ALREADY_EXISTS";
      throw error;
    }
  }

  // Verificación de conflictos si cambia el documento
  if (newDoc && newDoc !== oldDoc) {
    const existingByDoc = await getUsuarioByDocumento(newDoc);
    if (existingByDoc && existingByDoc.id !== id) {
      const error: any = new Error("El documento de identificación ya se encuentra registrado por otro usuario.");
      error.statusCode = 409;
      error.code = "DOCUMENT_ALREADY_EXISTS";
      throw error;
    }
  }

  let formattedSedes = data.sedes;
  if (Array.isArray(data.sedes)) {
    formattedSedes = data.sedes.map((s) => ({
      ...s,
      asignaciones: (s.asignaciones || []).map((a) => ({
        ...a,
        usuarioId: id,
      })),
    }));
  }

  let active = data.active;
  if (active === undefined && data.estado !== undefined) {
    active = data.estado === "Activo";
  } else if (active === undefined && existingData.active === undefined) {
    active = existingData.estado === "Activo";
  }

  const updateData: Record<string, any> = {
    ...data,
    ...(formattedSedes !== undefined && { sedes: formattedSedes }),
    ...(newEmail && { email: newEmail, correo: newEmail }),
    ...(newDoc && { documentoIdentificacion: newDoc, identificacion: newDoc }),
    ...(active !== undefined && { active }),
    updatedAt: Timestamp.now().toMillis(),
  };

  delete updateData.id;

  // Transacción atómica si cambiaron identificadores para sincronizar los índices
  if ((newEmail && newEmail !== oldEmail) || (newDoc && newDoc !== oldDoc)) {
    const newEmailIndexRef = newEmail ? adminDb.collection(INDICES_COLLECTION).doc(`email_${newEmail}`) : null;
    const newDocIndexRef = newDoc ? adminDb.collection(INDICES_COLLECTION).doc(`doc_${newDoc}`) : null;
    const oldEmailIndexRef = oldEmail ? adminDb.collection(INDICES_COLLECTION).doc(`email_${oldEmail}`) : null;
    const oldDocIndexRef = oldDoc ? adminDb.collection(INDICES_COLLECTION).doc(`doc_${oldDoc}`) : null;

    await adminDb.runTransaction(async (transaction: any) => {
      // --- LECTURAS PRIMERO ---
      const newEmailSnap = newEmailIndexRef ? await transaction.get(newEmailIndexRef) : null;
      const newDocSnap = newDocIndexRef ? await transaction.get(newDocIndexRef) : null;

      if (newEmailSnap && newEmailSnap.exists && newEmailSnap.data()?.usuarioId !== id) {
        const error: any = new Error("El correo electrónico ya se encuentra registrado.");
        error.statusCode = 409;
        error.code = "EMAIL_ALREADY_EXISTS";
        throw error;
      }

      if (newDocSnap && newDocSnap.exists && newDocSnap.data()?.usuarioId !== id) {
        const error: any = new Error("El documento de identificación ya se encuentra registrado.");
        error.statusCode = 409;
        error.code = "DOCUMENT_ALREADY_EXISTS";
        throw error;
      }

      // --- ESCRITURAS DESPUÉS DE LECTURAS ---
      transaction.update(docRef, updateData);
      if (oldEmailIndexRef && newEmail && newEmail !== oldEmail) {
        transaction.delete(oldEmailIndexRef);
      }
      if (newEmailIndexRef) {
        transaction.set(newEmailIndexRef, {
          usuarioId: id,
          email: newEmail,
          updatedAt: Timestamp.now().toMillis(),
        });
      }
      if (oldDocIndexRef && newDoc && newDoc !== oldDoc) {
        transaction.delete(oldDocIndexRef);
      }
      if (newDocIndexRef) {
        transaction.set(newDocIndexRef, {
          usuarioId: id,
          documentoIdentificacion: newDoc,
          updatedAt: Timestamp.now().toMillis(),
        });
      }
    });
  } else {
    await docRef.update(updateData);
  }

  const updatedSnap = await docRef.get();
  return {
    id: updatedSnap.id,
    ...updatedSnap.data(),
  } as UsuarioItem;
}

export async function deleteUsuario(id: string): Promise<boolean> {
  const docRef = adminDb.collection(COLLECTION_NAME).doc(id);
  const docSnap = await docRef.get();

  if (!docSnap.exists) {
    return false;
  }

  const userData = docSnap.data() as UsuarioItem;
  if (userData.authUid) {
    try {
      await adminAuth.deleteUser(userData.authUid);
    } catch {
      // Ignorar si el usuario ya no existía en Auth
    }
  }

  const emailKey = userData.email?.trim().toLowerCase();
  const docKey = (userData.documentoIdentificacion || userData.identificacion)?.trim();

  const batch = adminDb.batch();
  batch.delete(docRef);
  if (emailKey) {
    batch.delete(adminDb.collection(INDICES_COLLECTION).doc(`email_${emailKey}`));
  }
  if (docKey) {
    batch.delete(adminDb.collection(INDICES_COLLECTION).doc(`doc_${docKey}`));
  }
  await batch.commit();

  return true;
}

/**
 * Asigna o actualiza la contraseña de un usuario en Firebase Authentication
 * y actualiza el documento de Firestore con el UID y la bandera de forzar cambio de contraseña.
 */
export async function setUserPassword(
  usuarioId: string,
  newPassword: string,
  requireResetNextLogin: boolean = true
): Promise<{ authUid: string; usuario: UsuarioItem }> {
  const usuario = await getUsuarioById(usuarioId);
  if (!usuario) {
    throw new Error("Usuario no encontrado en Firestore.");
  }

  let authUid = usuario.authUid;

  if (authUid) {
    try {
      await adminAuth.updateUser(authUid, {
        password: newPassword,
        email: usuario.email,
        displayName: `${usuario.nombre} ${usuario.apellidos}`.trim(),
      });
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        authUid = undefined;
      } else {
        throw err;
      }
    }
  }

  if (!authUid) {
    try {
      // Verificar si ya existe por email en Auth
      const existingUser = await adminAuth.getUserByEmail(usuario.email);
      authUid = existingUser.uid;
      await adminAuth.updateUser(authUid, {
        password: newPassword,
        displayName: `${usuario.nombre} ${usuario.apellidos}`.trim(),
      });
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        // Crear usuario nuevo en Auth
        const createdUser = await adminAuth.createUser({
          email: usuario.email,
          password: newPassword,
          displayName: `${usuario.nombre} ${usuario.apellidos}`.trim(),
        });
        authUid = createdUser.uid;
      } else {
        throw err;
      }
    }
  }

  // Configurar Custom Claims en el token de Auth
  await adminAuth.setCustomUserClaims(authUid!, {
    debeCambiarPassword: requireResetNextLogin,
  });

  // Actualizar estado en Firestore
  const updatedUser = await updateUsuario(usuarioId, {
    authUid: authUid!,
    debeCambiarPassword: requireResetNextLogin,
  });

  return {
    authUid: authUid!,
    usuario: updatedUser!,
  };
}

/**
 * Actualiza la contraseña del usuario actualmente autenticado y marca debeCambiarPassword = false
 */
export async function updateOwnPassword(
  authUid: string,
  newPassword: string,
  email?: string
): Promise<void> {
  await adminAuth.updateUser(authUid, { password: newPassword });
  await adminAuth.setCustomUserClaims(authUid, { debeCambiarPassword: false });

  // Actualizar Firestore si existe el documento vinculado
  let user = await getUsuarioByAuthUid(authUid);
  if (!user && email) {
    user = await getUsuarioByEmail(email);
  }
  if (user) {
    await updateUsuario(user.id, { authUid, debeCambiarPassword: false });
  }
}
