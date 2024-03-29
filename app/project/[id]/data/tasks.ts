import { DesignTask, DesignTaskSpec } from "./types"

const day = 60*60*24;

// TODO put this in the database
const data: DesignTask[] = [

  // ======================== legal ========================
  {
    id: 1234,
    type: "legal",
    title: "Title Search",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: [],
    priority: "high",
    duration: 2*day, // seconds, better units?
    estimation: 1*day,
    lastUpdated: Date.now()-3487*1000,
  },
  {
    id: 1235,
    type: "legal",
    title: "Land Survey",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa"],
    priority: "normal",
    duration: 2*day,
    estimation: 7*day,
    lastUpdated: Date.now()-3048*1000,
  },
  {
    id: 1236,
    type: "legal",
    title: "Zoning Compliance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 2*day,
    estimation: 2*day,
    lastUpdated: Date.now()-98*1000,
  },
  {
    id: 1234,
    type: "legal",
    title: "Due Diligence",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "high",
    duration: 3*day,
    estimation: 2*day,
    lastUpdated: Date.now()-97*1000,
  },
  {
    id: 1235,
    type: "legal",
    title: "Financial Verification",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc", "dd", "ee"],
    priority: "normal",
    duration: 3*day,
    estimation: 2*day,
    lastUpdated: Date.now()-96*1000,
  },
  {
    id: 1236,
    type: "legal",
    title: "Drafting and Reviewing Contracts",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1236,
    type: "legal",
    title: "Inspections",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Closing Preparation",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Title Insurance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Recording Documents",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Payment Transactions",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Compliance with Building Codes",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Occupancy Permits",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Notarization",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Communication with Stakeholders",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "legal",
    title: "Post-Closing Documentation",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },

  // ======================== architectural ========================
  {
    id: 1234,
    type: "architectural",
    title: "Site Analysis",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: [],
    priority: "high",
    duration: 2*day,
    estimation: 5*day,
    lastUpdated: Date.now()-3487*1000,
  },
  {
    id: 1235,
    type: "architectural",
    title: "Program Development",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa"],
    priority: "normal",
    duration: 4*day,
    estimation: 5*day,
    lastUpdated: Date.now()-3048*1000,
  },
  {
    id: 1236,
    type: "architectural",
    title: "Conceptual Design",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 3*day,
    estimation: 8*day,
    lastUpdated: Date.now()-98*1000,
  },
  {
    id: 1234,
    type: "architectural",
    title: "Schematic Design",
    status: "complete",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "high",
    duration: 2*day,
    estimation: 7*day,
    lastUpdated: Date.now()-97*1000,
  },
  {
    id: 1235,
    type: "architectural",
    title: "Design Development",
    status: "in progress",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc", "dd", "ee"],
    priority: "normal",
    duration: 3*day,
    estimation: 8*day,
    lastUpdated: Date.now()-96*1000,
  },
  {
    id: 1236,
    type: "architectural",
    title: "Coordination with Consultants",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 1*day,
    estimation: 6*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1236,
    type: "architectural",
    title: "Regulatory Compliance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 1*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Regulatory Compliance",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Construction Documents",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Material Specifications",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Cost Estimation",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Contractor Selection",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Construction Administration",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Quality Control",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "As-Built Drawings",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Project Closeout",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },
  {
    id: 1237,
    type: "architectural",
    title: "Documentation and Archiving",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },

  // ======================== structural ========================
  {
    id: 1237,
    type: "structural",
    title: "Something Structural",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },


  // ======================== MEP ========================
  {
    id: 1237,
    type: "mep",
    title: "Something Mechanical",
    status: "pending",
    lead: "ken99@yahoo.com",
    members: ["aa", "bb", "cc"],
    priority: "low",
    duration: 0*day,
    estimation: 5*day,
    lastUpdated: Date.now(),
  },


];

export function getProjectTasks(projectid: number) {
  return data;
}


// be very careful with changing the ids as they are referenced elsewhere
export const taskSpecs: DesignTaskSpec[] = [

  // ======================== legal ========================
  {
    id: 100,
    title: "Title Search",
    designType: "legal",
    description: [
      "Verify ownership and title of the property.",
      "Check for any existing liens or encumbrances.",
    ],
  },
  {
    id: 101,
    title: "Land Survey",
    designType: "legal",
    description: [
      "Conduct a land survey to accurately define the property boundaries.",
    ],
  },
  {
    id: 102,
    title: "Zoning Compliance",
    designType: "legal",
    description: [
      "Ensure the building complies with local zoning regulations.",
      "Obtain necessary permits and approvals.",
    ],
  },
  {
    id: 103,
    title: "Due Diligence",
    designType: "legal",
    description: [
      "Investigate any legal issues or disputes related to the property.",
      "Review environmental assessments if applicable.",
    ],
  },
  {
    id: 104,
    title: "Financial Verification",
    designType: "legal",
    description: [
      "Confirm financial aspects, such as outstanding mortgages or loans.",
      "Verify property tax status.",
    ],
  },
  {
    id: 105,
    title: "Drafting and Reviewing Contracts",
    designType: "legal",
    description: [
      "Prepare contracts, including sales agreements or lease agreements.",
      "Have legal professionals review and revise the contracts.",
    ],
  },
  {
    id: 106,
    title: "Inspections",
    designType: "legal",
    description: [
      "Arrange for building inspections to assess structural and safety compliance.",
    ],
  },
  {
    id: 107,
    title: "Closing Preparation",
    designType: "legal",
    description: [
      "Coordinate with all parties involved in the transaction.",
      "Prepare closing documents and ensure all necessary signatures are obtained.",
    ],
  },
  {
    id: 108,
    title: "Title Insurance",
    designType: "legal",
    description: [
      "Secure title insurance to protect against potential title defects.",
    ],
  },
  {
    id: 109,
    title: "Recording Documents",
    designType: "legal",
    description: [
      "File the necessary documents with the appropriate government office to record the transaction.",
    ],
  },
  {
    id: 110,
    title: "Payment Transactions",
    designType: "legal",
    description: [
      "Facilitate the transfer of funds and ensure all financial transactions are completed.",
    ],
  },
  {
    id: 111,
    title: "Compliance with Building Codes",
    designType: "legal",
    description: [
      "Confirm that the building adheres to local building codes and regulations.",
    ],
  },
  {
    id: 112,
    title: "Occupancy Permits",
    designType: "legal",
    description: [
      "Obtain any required occupancy permits or certificates.",
    ],
  },
  {
    id: 113,
    title: "Notarization",
    designType: "legal",
    description: [
      "Ensure that relevant documents are properly notarized.",
    ],
  },
  {
    id: 114,
    title: "Communication with Stakeholders",
    designType: "legal",
    description: [
      "Maintain open communication with buyers, sellers, agents, and legal representatives throughout the process.",
    ],
  },
  {
    id: 115,
    title: "Post-Closing Documentation",
    designType: "legal",
    description: [
      "Organize and store all completed documentation for future reference.",
    ],
  },

  // ======================== architectural ========================
  {
    id: 116,
    title: "Site Analysis",
    designType: "architectural",
    description: [
      "Evaluate the site conditions",
      "Consider environmental factors like sun orientation, wind patterns, and topography.",
    ]
  },
  {
    id: 117,
    title: "Program Development",
    designType: "architectural",
    description: [
      "Define the purpose and functionality of the building",
      "Understand space requirements for different functions.",
    ]
  },
  {
    id: 118,
    title: "Conceptual Design",
    designType: "architectural",
    description: [
      "Develop initial design concepts",
      "Explore various architectural forms and styles.",
    ]
  },
  {
    id: 119,
    title: "Schematic Design",
    designType: "architectural",
    description: [
      "Refine the chosen concept",
      "Develop preliminary floor plans and elevations.",
    ]
  },
  {
    id: 120,
    title: "Design Development",
    designType: "architectural",
    description: [
      "Add more detail to the design",
      "Develop sections and details.",
      "Consider structural and mechanical systems.",
    ]
  },
  {
    id: 121,
    title: "Coordination with Consultants",
    designType: "architectural",
    description: [
      "Collaborate with structural, mechanical, and electrical engineers",
      "Ensure all systems are integrated seamlessly.",
    ]
  },
  {
    id: 122,
    title: "Regulatory Compliance",
    designType: "architectural",
    description: [
      "Ensure designs comply with local building codes and regulations",
      "Obtain necessary permits.",
    ]
  },
  {
    id: 123,
    title: "Construction Documents",
    designType: "architectural",
    description: [
      "Create detailed drawings for construction",
      "Include floor plans, elevations, sections, and details.",
    ]
  },
  {
    id: 124,
    title: "Material Specifications",
    designType: "architectural",
    description: [
      "Specify materials and finishes for construction",
      "Consider sustainability and durability.",
    ]
  },
  {
    id: 125,
    title: "Cost Estimation",
    designType: "architectural",
    description: [
      "Prepare a detailed cost estimate based on the design",
      "Evaluate the project's financial feasibility.",
    ]
  },
  {
    id: 126,
    title: "Contractor Selection",
    designType: "architectural",
    description: [
      "Assist in the selection of a general contractor",
      "Review bids and proposals.",
    ]
  },
  {
    id: 127,
    title: "Construction Administration",
    designType: "architectural",
    description: [
      "Address questions and clarifications during construction",
      "Ensure that the construction aligns with the drawings.",
    ]
  },
  {
    id: 128,
    title: "Quality Control",
    designType: "architectural",
    description: [
      "Monitor the quality of work during construction",
      "Make site visits to ensure compliance with the drawings.",
    ]
  },
  {
    id: 129,
    title: "As-Built Drawings",
    designType: "architectural",
    description: [
      "Document any changes made during construction",
      "Create final as-built drawings.",
    ]
  },
  {
    id: 130,
    title: "Project Closeout",
    designType: "architectural",
    description: [
      "Ensure all regulatory inspections are completed",
      "Confirm that the building meets the client's requirements.",
    ]
  },
  {
    id: 131,
    title: "Documentation and Archiving",
    designType: "architectural",
    description: [
      "Organize and archive all project-related documents",
      "Create a comprehensive record for future reference.",
    ]
  },


];