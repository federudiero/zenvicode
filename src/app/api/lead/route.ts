// src/app/api/lead/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAdminDb } from "../../../lib/firebaseAdmin"; // ← ruta relativa
import * as admin from "firebase-admin";

type Body = { name?: string; email?: string; message?: string; source?: string; };

function s(x?: string) { return (x || "").toString().trim().slice(0, 10000); }

export async function POST(req: Request) {
  try {
    if (!(req.headers.get("content-type") || "").includes("application/json")) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 415 });
    }

    const b = (await req.json()) as Body;

    const doc = {
      name: s(b.name),
      email: s(b.email),
      message: s(b.message),
      source: s(b.source) || "web",
      status: "nuevo",
      priority: "normal",
      assignedTo: null,
      followUpAt: null,
      lastNote: "",
      notes: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!doc.name || !doc.message) {
      return NextResponse.json({ error: "name y message son requeridos" }, { status: 400 });
    }

    const db = getAdminDb();
    const ref = await db.collection("leads").add(doc);
    return NextResponse.json({ id: ref.id }, { status: 201 });

  } catch (err: any) {
    console.error("POST /api/lead failed:", err);
    return NextResponse.json({ error: String(err?.message || err) }, { status: 500 });
  }
}
