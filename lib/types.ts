export type JobStatus =
  | { status: 'pending' | 'processing' }
  | { status: 'done'; outputUrl: string; dataUrl?: string } // dataUrl => presigned JSON

export type PlayerTrack = {
  id: number
  team?: string
  has_ball?: boolean
  x: number
  y: number
  t: number // seconds or ms (be consistent from backend)
}

export type FrameTrack = {
  t: number
  players: PlayerTrack[]
  // ball?: { x: number; y: number } // if you want ball track too
}

/** The JSON your backend writes to S3 at output_data/{job_id}.json */
export type TrackFile = {
  // metadata?: { pitchScaleMetersPerPx?: number }
  frames: FrameTrack[]
}
