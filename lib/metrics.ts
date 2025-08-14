import { TrackFile } from './types'

export type PlayerMetrics = {
  playerId: number
  team?: string
  possessionRate: number   // 0..1
  avgSpeed: number         // units/sec (meters/sec if your coords are meters)
  maxSpeed: number
}

export function computeMetrics(data: TrackFile): PlayerMetrics[] {
  // map of playerId -> { samples: [...], hasBallCount, totalTime }
  const byPlayer = new Map<number, { team?: string; pts: { t:number;x:number;y:number;hasBall?:boolean }[] }>()

  for (const f of data.frames) {
    for (const p of f.players) {
      const m = byPlayer.get(p.id) ?? { team: p.team, pts: [] }
      m.team ??= p.team
      m.pts.push({ t: p.t, x: p.x, y: p.y, hasBall: p.has_ball })
      byPlayer.set(p.id, m)
    }
  }

  const out: PlayerMetrics[] = []
  for (const [id, { team, pts }] of byPlayer.entries()) {
    if (pts.length < 2) {
      out.push({ playerId: id, team, possessionRate: 0, avgSpeed: 0, maxSpeed: 0 })
      continue
    }

    // sort by time just in case
    pts.sort((a,b)=>a.t-b.t)

    let dist = 0
    const timeSpan = (pts[pts.length-1].t - pts[0].t) || 1
    let maxSpeed = 0
    let hasBallCount = 0

    for (let i=1;i<pts.length;i++) {
      const dx = pts[i].x - pts[i-1].x
      const dy = pts[i].y - pts[i-1].y
      const dt = Math.max(1e-6, (pts[i].t - pts[i-1].t))
      const stepDist = Math.hypot(dx, dy)
      const stepSpeed = stepDist / dt
      dist += stepDist
      if (stepSpeed > maxSpeed) maxSpeed = stepSpeed
      if (pts[i].hasBall) hasBallCount++
    }

    const possessionRate = hasBallCount / Math.max(1, pts.length)
    const avgSpeed = dist / timeSpan

    out.push({ playerId: id, team, possessionRate, avgSpeed, maxSpeed })
  }
  return out.sort((a,b)=>a.playerId-b.playerId)
}
