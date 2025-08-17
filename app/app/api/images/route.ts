import { NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const dir = path.join(process.cwd(), 'public', 'images')
    const entries = await fs.readdir(dir, { withFileTypes: true })
    const files = entries
      .filter((e) => e.isFile())
      .map((e) => e.name)
      .filter((n) => !n.toLowerCase().endsWith('.zip'))
      .map((n) => `/images/${n}`)
    return NextResponse.json(files)
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list images' }, { status: 500 })
  }
}


