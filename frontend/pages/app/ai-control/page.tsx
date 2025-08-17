'use client'

import AIControlCenter from '@/components/AIControlCenter'
import AdminGuard from '@/components/admin-guard'

export default function AIControlCenterPage() {
  return (
    <AdminGuard>
      <AIControlCenter />
    </AdminGuard>
  )
}
