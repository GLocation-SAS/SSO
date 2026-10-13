import { initializeApp, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";

const PROJECTS = ["demo-sso"];

async function seedProject(projectId) {
  console.log(`\n======================================================`);
  console.log(`  Sembrando Super Admin en proyecto: ${projectId}`);
  console.log(`======================================================`);

  const appName = `admin-${projectId}`;
  const app = getApps().find((a) => a.name === appName) || initializeApp({ projectId }, appName);
  const adminAuth = getAuth(app);
  const adminDb = getFirestore(app);

  const email = "jeimy.mateus@glocation.com.co";
  const password = "Ab123456**";
  const nombre = "Jeimy";
  const apellidos = "Mateus";
  const documento = "1719874563";

  // 1. Firebase Auth
  let authUser;
  try {
    authUser = await adminAuth.getUserByEmail(email);
    console.log(`[Auth] Usuario encontrado (${authUser.uid}), actualizando contraseña...`);
    await adminAuth.updateUser(authUser.uid, {
      password,
      emailVerified: true,
      displayName: `${nombre} ${apellidos}`,
    });
  } catch (err) {
    if (err.code === "auth/user-not-found") {
      console.log("[Auth] Creando usuario nuevo en Firebase Auth...");
      authUser = await adminAuth.createUser({
        email,
        password,
        emailVerified: true,
        displayName: `${nombre} ${apellidos}`,
      });
      console.log(`[Auth] Creado con UID: ${authUser.uid}`);
    } else {
      throw err;
    }
  }

  // Set Custom Claims
  await adminAuth.setCustomUserClaims(authUser.uid, {
    twoFactorVerified: true,
    debeCambiarPassword: false,
    admin: true,
  });
  console.log("[Auth] Custom claims aplicados: twoFactorVerified=true, debeCambiarPassword=false, admin=true");

  // 2. Cloud Firestore
  const now = Timestamp.now().toMillis();
  const userId = `usr-superadmin-${authUser.uid}`;

  // Verificar si ya existe en Firestore
  const existingDocs = await adminDb.collection("usuarios").where("email", "==", email).get();
  let targetDocRef;
  if (!existingDocs.empty) {
    targetDocRef = existingDocs.docs[0].ref;
    console.log(`[Firestore] Documento existente: ${targetDocRef.id}`);
  } else {
    targetDocRef = adminDb.collection("usuarios").doc(userId);
    console.log(`[Firestore] Creando nuevo documento: ${targetDocRef.id}`);
  }

  const allApps = [
    {
      appNombre: "SSO",
      rolNombre: "Super Administrador",
      rolId: "ra-sso-sa",
      permisos: [
        { recursoCodigo: "ALL-SEC", recursoNombre: "Seguridad y Auditoría Global", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
        { recursoCodigo: "USR-CONS", recursoNombre: "Gestión de Usuarios", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "Gestión Docente",
      rolNombre: "Administrador",
      rolId: "ra-gd-adm",
      permisos: [
        { recursoCodigo: "EXP-DOC", recursoNombre: "Expediente Docente", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
        { recursoCodigo: "DIS-TRAB", recursoNombre: "Distributivo de Trabajo", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "SIGE",
      rolNombre: "Auditor Nacional",
      rolId: "ra-sige-an",
      permisos: [
        { recursoCodigo: "AUD-NAC", recursoNombre: "Auditoría Nacional", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "Geoportal",
      rolNombre: "Administrador de Capas",
      rolId: "ra-geo-adm",
      permisos: [
        { recursoCodigo: "GEO-ALL", recursoNombre: "Capas y Mapas", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "SAE",
      rolNombre: "Coordinador de Admisión",
      rolId: "ra-sae-adm",
      permisos: [
        { recursoCodigo: "SAE-ALL", recursoNombre: "Admisiones", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "SGC",
      rolNombre: "Director de Gestión Calidad",
      rolId: "ra-sgc-adm",
      permisos: [
        { recursoCodigo: "SGC-ALL", recursoNombre: "Gestión de Calidad", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "Trámites",
      rolNombre: "Gestor de Trámites",
      rolId: "ra-tram-adm",
      permisos: [
        { recursoCodigo: "TRAM-ALL", recursoNombre: "Trámites y Certificaciones", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "Innovación",
      rolNombre: "Evaluador de Proyectos",
      rolId: "ra-inno-adm",
      permisos: [
        { recursoCodigo: "INNO-ALL", recursoNombre: "Innovación y Proyectos", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
    {
      appNombre: "Notas",
      rolNombre: "Coordinadores Zonales",
      rolId: "ra-notas-cz",
      permisos: [
        { recursoCodigo: "NOTAS-ALL", recursoNombre: "Gestión de Notas y Calificaciones", puedeVer: true, puedeCrear: true, puedeEditar: true, puedeEliminar: true },
      ],
    },
  ];

  const asignaciones = allApps.map((a, idx) => ({
    id: `asig-sa-${idx + 1}`,
    usuarioId: targetDocRef.id,
    sedeId: "sede-pc",
    sedeNombre: "Planta Central",
    rolAplicacionId: a.rolId,
    aplicacionNombre: a.appNombre,
    rolNombre: a.rolNombre,
    estado: "Activo",
    fechaAsignacion: new Date().toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    permisos: a.permisos,
  }));

  const usuarioData = {
    id: targetDocRef.id,
    nombre,
    apellidos,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(nombre + " " + apellidos)}&background=0D8ABC&color=fff`,
    tipoDocumento: "Cédula",
    documentoIdentificacion: documento,
    identificacion: documento,
    email,
    correo: email,
    telefono: "+593 99 999 9999",
    cargo: "Super Administrador",
    estado: "Activo",
    active: true,
    authUid: authUser.uid,
    debeCambiarPassword: false,
    fechaCreacion: new Date().toLocaleDateString("es-EC", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    createdAt: now,
    updatedAt: now,
    sedes: [
      {
        sedeId: "sede-pc",
        sedeNombre: "Planta Central",
        asignaciones,
      },
    ],
  };

  await targetDocRef.set(usuarioData, { merge: true });

  await adminDb.collection("usuarios_indices").doc(`email_${email}`).set({
    usuarioId: targetDocRef.id,
    email,
    createdAt: now,
  });

  await adminDb.collection("usuarios_indices").doc(`doc_${documento}`).set({
    usuarioId: targetDocRef.id,
    documento,
    createdAt: now,
  });

  console.log(`[Firestore] Documento y sus índices sincronizados correctamente.`);
  return { uid: authUser.uid, firestoreId: targetDocRef.id };
}

async function main() {
  for (const pid of PROJECTS) {
    await seedProject(pid);
  }
  console.log("\n>>> Configuración completada exitosamente en todos los proyectos del emulador. <<<");
}

main().catch((err) => {
  console.error("Error al ejecutar seed:", err);
  process.exit(1);
});
