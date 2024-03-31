export type DesignTask = {
  id: number,
  type: "legal" | "architectural" | "structural" | "mep" | "other",
  specid: number,
  title: string,
  status: "pending" | "in progress" | "complete" | "canceled",
  lead: string, // user ids
  members: string[], // user ids
  priority: "high" | "normal" | "low",
  duration: number,
  estimation: number,
  lastUpdated: number,
}

export type DesignTaskSpec = {
  id: number,
  designType: "legal" | "architectural" | "structural" | "mep",
  title: string,
  description: string[],
}