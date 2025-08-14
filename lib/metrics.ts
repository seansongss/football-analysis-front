import { TrackFile } from './types'

export type PlayerMetrics = {
  playerId: number
  team?: string
  possessionRate: number   // 0..1
  currentSpeed: number
  avgSpeed: number
  maxSpeed: number
}

export function computeMetrics(data: TrackFile, currentTime: number): PlayerMetrics[] {
  console.log('computeMetrics called with currentTime:', currentTime)
  
  const byPlayer = new Map<number, { team?: string; pts: { t:number;x:number;y:number;hasBall?:boolean }[] }>()

  // Process frames and assign timestamps to players
  for (const f of data.frames) {
    for (const p of f.players) {
      const m = byPlayer.get(p.id) ?? { team: p.team, pts: [] }
      m.team ??= p.team
      m.pts.push({ t: f.t, x: p.x, y: p.y, hasBall: p.has_ball })
      byPlayer.set(p.id, m)
    }
  }

  const out: PlayerMetrics[] = []
  for (const [id, { team, pts }] of byPlayer.entries()) {
    console.log(`Processing player ${id}, total points: ${pts.length}`)
    
    if (pts.length < 2) {
      out.push({ playerId: id, team, possessionRate: 0, currentSpeed: 0, avgSpeed: 0, maxSpeed: 0 })
      continue
    }

    pts.sort((a,b)=>a.t-b.t)

    // Find the closest frame to current time
    const closestFrameIndex = pts.reduce((closest, pt, index) => {
      return Math.abs(pt.t - currentTime) < Math.abs(pts[closest].t - currentTime) ? index : closest
    }, 0)
    
    // Get points up to the closest frame
    const currentPts = pts.slice(0, closestFrameIndex + 1)
    console.log(`Player ${id}: using ${currentPts.length} points up to closest frame at time ${currentPts[currentPts.length - 1]?.t}`)
    console.log(`Available timestamps:`, pts.map(p => p.t))
    
    if (currentPts.length < 2) {
      out.push({ playerId: id, team, possessionRate: 0, currentSpeed: 0, avgSpeed: 0, maxSpeed: 0 })
      continue
    }

    const speeds: number[] = []
    let hasBallCount = 0
    let currentSpeed = 0

    // Calculate all speeds for average and max (including current speed)
    for (let i=1;i<currentPts.length;i++) {
      const dx = currentPts[i].x - currentPts[i-1].x
      const dy = currentPts[i].y - currentPts[i-1].y
      const dt = currentPts[i].t - currentPts[i-1].t
      
      // Skip if no time difference
      if (dt <= 0) continue
      
      const stepDist = Math.hypot(dx, dy)
      const stepSpeed = stepDist / dt
      
      // Only add valid speeds
      if (!isNaN(stepSpeed) && isFinite(stepSpeed)) {
        speeds.push(stepSpeed)
        
        // Current speed is the last calculated speed
        if (i === currentPts.length - 1) {
          currentSpeed = stepSpeed
          console.log(`Player ${id} current speed calc: dx=${dx}, dy=${dy}, dt=${dt}`)
          console.log(`Player ${id} current speed: stepDist=${stepDist}, currentSpeed=${currentSpeed}`)
        }
      }
      
      if (currentPts[i].hasBall) hasBallCount++
    }

    const possessionRate = hasBallCount / Math.max(1, currentPts.length)
    const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0

    console.log(`Player ${id} final metrics: currentSpeed=${currentSpeed}, avgSpeed=${avgSpeed}, maxSpeed=${maxSpeed}, speeds array:`, speeds)

    out.push({ playerId: id, team, possessionRate, currentSpeed, avgSpeed, maxSpeed })
  }
  return out.sort((a,b)=>a.playerId-b.playerId)
}
