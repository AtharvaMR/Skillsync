import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { checkRateLimit } from '@/lib/rate-limit';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIME = new Set([
  'application/pdf',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'image/webp',
]);

const EXT_BY_MIME: Record<string, string> = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'text/markdown': '.md',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
};

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rate = checkRateLimit(`upload:${user.id}`, 20, 15 * 60 * 1000);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Upload rate limit reached. Retry in ${rate.retryAfterSeconds}s.` },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');
    const purpose = String(formData.get('purpose') || 'portfolio_evidence');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size === 0 || file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File must be between 1 byte and 5 MB.' }, { status: 400 });
    }

    const mimeType = file.type || 'application/octet-stream';
    if (!ALLOWED_MIME.has(mimeType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Allowed: PDF, TXT, MD, PNG, JPG, WEBP.' },
        { status: 400 }
      );
    }

    const uploadDir = path.resolve(process.cwd(), '.uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileId = `upl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const ext = EXT_BY_MIME[mimeType] || '';
    const storedName = `${fileId}${ext}`;
    const destPath = path.join(uploadDir, storedName);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(destPath, buffer);

    let extractedText = '';
    if (mimeType === 'text/plain' || mimeType === 'text/markdown') {
      extractedText = buffer.toString('utf8').slice(0, 12000);
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO uploaded_files (id, user_id, original_name, stored_name, mime_type, size_bytes, purpose, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      fileId,
      user.id,
      path.basename(file.name).slice(0, 160),
      storedName,
      mimeType,
      file.size,
      purpose.slice(0, 50),
      new Date().toISOString()
    );

    return NextResponse.json(
      {
        id: fileId,
        originalName: path.basename(file.name),
        mimeType,
        sizeBytes: file.size,
        url: `/api/uploads/${fileId}`,
        extractedText,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'File upload failed.' }, { status: 500 });
  }
}
