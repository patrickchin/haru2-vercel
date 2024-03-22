import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { LucideArrowUpDown, LucideChevronRight } from "lucide-react"
import Link from "next/link"
import ReactTimeAgo from "react-time-ago"

export type DesignTask = {
  id: number
  title: string
  status: "pending" | "in progress" | "complete" | "canceled"
  lead: string // user ids
  members: string[] // user ids
  priority: "high" | "normal" | "low"
  lastUpdated: number
}

export type TaskSpec = {
  title: string,
  description: string[],
}

// TODO put this in the database
export const architecturalData: DesignTask[] = [
  {
    id: 1234,
    title: "Site Analysis",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: [],
    priority: "high",
    lastUpdated: Date.now()-3487*1000,
  },
  {
    id: 1235,
    title: "Program Development",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa"],
    priority: "normal",
    lastUpdated: Date.now()-3048*1000,
  },
  {
    id: 1236,
    title: "Conceptual Design",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now()-98*1000,
  },
  {
    id: 1234,
    title: "Schematic Design",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "high",
    lastUpdated: Date.now()-97*1000,
  },
  {
    id: 1235,
    title: "Design Development",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc", "dd", "ee"],
    priority: "normal",
    lastUpdated: Date.now()-96*1000,
  },
  {
    id: 1236,
    title: "Coordination with Consultants",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1236,
    title: "Regulatory Compliance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Regulatory Compliance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Construction Documents",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Material Specifications",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Cost Estimation",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Contractor Selection",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Construction Administration",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Quality Control",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "As-Built Drawings",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Project Closeout",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    title: "Documentation and Archiving",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    lastUpdated: Date.now(),
  },
]

export const archtecturalTasks: TaskSpec[] = [
  {
    title: "Site Analysis",
    description: [
      "Evaluate the site conditions",
      "Consider environmental factors like sun orientation, wind patterns, and topography.",
    ]
  },
  {
    title: "Program Development",
    description: [
      "Define the purpose and functionality of the building",
      "Understand space requirements for different functions.",
    ]
  },
  {
    title: "Conceptual Design",
    description: [
      "Develop initial design concepts",
      "Explore various architectural forms and styles.",
    ]
  },
  {
    title: "Schematic Design",
    description: [
      "Refine the chosen concept",
      "Develop preliminary floor plans and elevations.",
    ]
  },
  {
    title: "Design Development",
    description: [
      "Add more detail to the design",
      "Develop sections and details.",
      "Consider structural and mechanical systems.",
    ]
  },
  {
    title: "Coordination with Consultants",
    description: [
      "Collaborate with structural, mechanical, and electrical engineers",
      "Ensure all systems are integrated seamlessly.",
    ]
  },
  {
    title: "Regulatory Compliance",
    description: [
      "Ensure designs comply with local building codes and regulations",
      "Obtain necessary permits.",
    ]
  },
  {
    title: "Construction Documents",
    description: [
      "Create detailed drawings for construction",
      "Include floor plans, elevations, sections, and details.",
    ]
  },
  {
    title: "Material Specifications",
    description: [
      "Specify materials and finishes for construction",
      "Consider sustainability and durability.",
    ]
  },
  {
    title: "Cost Estimation",
    description: [
      "Prepare a detailed cost estimate based on the design",
      "Evaluate the project's financial feasibility.",
    ]
  },
  {
    title: "Contractor Selection",
    description: [
      "Assist in the selection of a general contractor",
      "Review bids and proposals.",
    ]
  },
  {
    title: "Construction Administration",
    description: [
      "Address questions and clarifications during construction",
      "Ensure that the construction aligns with the drawings.",
    ]
  },
  {
    title: "Quality Control",
    description: [
      "Monitor the quality of work during construction",
      "Make site visits to ensure compliance with the drawings.",
    ]
  },
  {
    title: "As-Built Drawings",
    description: [
      "Document any changes made during construction",
      "Create final as-built drawings.",
    ]
  },
  {
    title: "Project Closeout",
    description: [
      "Ensure all regulatory inspections are completed",
      "Confirm that the building meets the client's requirements.",
    ]
  },
  {
    title: "Documentation and Archiving",
    description: [
      "Organize and archive all project-related documents",
      "Create a comprehensive record for future reference.",
    ]
  },
];

export const architecturalColumns: ColumnDef<DesignTask>[] = [
  {
    accessorKey: "title",
    size: 300,
    header: () => <div>Title</div>,
    cell: ({ row }) => <Link href="#" className="font-medium">{row.getValue("title")}</Link>
    ,
  },
  {
    accessorKey: "lead",
    size: 50,
    header: ({ column }) => {
      return (
        <Button
          className="flex flex-row overflow-hidden w-18 p-2"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lead
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-row overflow-hidden w-12 items-center justify-center">
        <Avatar>
          {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
          <AvatarFallback>{(row.getValue("lead") as string).slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    )
  },
  {
    accessorKey: "members",
    size: 50,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Members
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="flex flex-row overflow-hidden w-32 space-x-1">
        {(row.getValue("members") as string[]).map((mem, i) =>
          <Avatar key={i}>
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>{mem.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        )}
      </div>
    )
  },
  {
    accessorKey: "status",
    size: 50,
    header: "Status",
    cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>
  },
  {
    accessorKey: "priority",
    size: 50,
    header: "Priority",
    cell: ({ row }) => <div className="capitalize">{row.getValue("priority")}</div>
  },
  {
    accessorKey: "lastUpdated",
    size: 50,
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="px-1"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <LucideArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {<ReactTimeAgo date={new Date(row.getValue("lastUpdated"))} locale="en-US" />}
      </div>
    ),
  },
  {
    accessorKey: "details",
    size: 50,
    header: () => <div className="w-8">Details</div>,
    cell: () => <Button asChild variant="outline" className="h-8 w-8 p-0">
      <Link href="#">
        <LucideChevronRight className="h-4 w-4"/>
      </Link>
    </Button>
    ,
  },
]

