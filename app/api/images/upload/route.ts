import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function sanitizeFileName(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || ''
  const base = path.basename(originalName, ext).toLowerCase().replace(/[^a-z0-9-_]+/g, '-')
  const stamp = Date.now()
  return `${base || 'image'}-${stamp}${ext || ''}`
}

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const maxSize = 8 * 1024 * 1024 // 8MB
    if (buffer.length > maxSize) {
      return NextResponse.json({ error: 'File too large (max 8MB)' }, { status: 413 })
    }

    const publicDir = path.join(process.cwd(), 'public', 'images')
    await fs.mkdir(publicDir, { recursive: true })
    const fileName = sanitizeFileName((file as any).name || 'upload.png')
    const target = path.join(publicDir, fileName)
    await fs.writeFile(target, buffer)

    const urlPath = `/images/${fileName}`
    return NextResponse.json({ ok: true, path: urlPath })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}


