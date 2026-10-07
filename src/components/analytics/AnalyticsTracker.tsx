'use client'

import { useEffect } from 'react'

import { recordVisit } from '@/lib/api/analyticsService'
import {
  getSessionId,
  getVisitorId,
} from '@/lib/analytics/session'

export default function AnalyticsTracker() {
  useEffect(() => {
    const visitorId = getVisitorId()
    const sessionId = getSessionId()

    void recordVisit(visitorId, sessionId).catch(() => {})
  }, [])

  return null
}
