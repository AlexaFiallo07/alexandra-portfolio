import { stat } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { MODEL_FILES } from '@/lib/modelFiles';

const ALLOWED_FILES = new Set<string>(Object.values(MODEL_FILES));

/** Devuelve si un GLB permitido está disponible en public/models. */
export async function GET(request: Request) {
  const file = new URL(request.url).searchParams.get('file') ?? '';
  const headers = { 'Cache-Control': 'no-store' };

  if (!ALLOWED_FILES.has(file)) {
    return NextResponse.json({ available: false }, { status: 400, headers });
  }

  try {
    const modelPath = path.join(process.cwd(), 'public', 'models', file);
    const info = await stat(modelPath);
    return NextResponse.json({ available: info.isFile() }, { headers });
  } catch {
    return NextResponse.json({ available: false }, { headers });
  }
}
