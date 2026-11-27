import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { getCurrentUser } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const db = getDb();

    const fileRow = db
      .prepare('SELECT id, user_id, original_name, stored_name, mime_type FROM uploaded_files WHERE id = ?')
      .get(id) as
      | { id: string; user_id: string; original_name: string; stored_name: string; mime_type: string }
      | undefined;

    if (!fileRow) {
      return NextResponse.json({ error: 'File not found.' }, { status: 404 });
    }

    const user = await getCurrentUser();
    const isStaff =
      user && (user.role === 'trainer' || user.role === 'institute' || user.role === 'government');
    const isOwner = user && user.id === fileRow.user_id;

    let isPublicPortfolioAsset = false;
    if (!isOwner && !isStaff) {
      const publicMatch = db
        .prepare(`
          SELECT p.id FROM portfolio_projects p
          JOIN learner_profiles lp ON lp.user_id = p.user_id
          WHERE p.attachment_path = ? AND lp.portfolio_public = 1
        `)
        .get(`/api/uploads/${fileRow.id}`);
      isPublicPortfolioAsset = Boolean(publicMatch);
    }

    if (!isOwner && !isStaff && !isPublicPortfolioAsset) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const filePath = path.resolve(process.cwd(), '.uploads', path.basename(fileRow.stored_name));
    const data = await fs.readFile(filePath);

    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': fileRow.mime_type,
        'Content-Disposition': `inline; filename="${fileRow.original_name.replace(/"/g, '')}"`,
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('File download error:', error);
    return NextResponse.json({ error: 'Unable to read file.' }, { status: 500 });
  }
}
