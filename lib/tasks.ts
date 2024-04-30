import { DesignTaskSpec } from "./types";

// be very careful with changing the ids as they are referenced elsewhere
export const defaulTaskSpecs: DesignTaskSpec[] = [
  // ======================== legal ========================
  {
    id: 100,
    title: "Title Search",
    type: "legal",
    description: `
      Verify ownership and title of the property.
      Check for any existing lines or encumbrances.
    `,
  },
  {
    id: 101,
    title: "Land Survey",
    type: "legal",
    description:
      "Conduct a land survey to accurately define the property boundaries.",
  },
  {
    id: 102,
    title: "Zoning Compliance",
    type: "legal",
    description: `
      Ensure the building complies with local zoning regulations.
      Obtain necessary permits and approvals.
    `,
  },
  {
    id: 103,
    title: "Due Diligence",
    type: "legal",
    description: `
      Investigate any legal issues or disputes related to the property.
      Review environmental assessments if applicable.
    `,
  },
  {
    id: 104,
    title: "Financial Verification",
    type: "legal",
    description: `
      Confirm financial aspects, such as outstanding mortgages or loans.
      Verify property tax status.
    `,
  },
  {
    id: 105,
    title: "Drafting and Reviewing Contracts",
    type: "legal",
    description: `
      Prepare contracts, including sales agreements or lease agreements.
      Have legal professionals review and revise the contracts.
    `,
  },
  {
    id: 106,
    title: "Inspections",
    type: "legal",
    description: `
      Arrange for building inspections to assess structural and safety compliance.
    `,
  },
  {
    id: 107,
    title: "Closing Preparation",
    type: "legal",
    description: `
      Coordinate with all parties involved in the transaction.
      Prepare closing documents and ensure all necessary signatures are obtained.
    `,
  },
  {
    id: 108,
    title: "Title Insurance",
    type: "legal",
    description: `
      Secure title insurance to protect against potential title defects.
    `,
  },
  {
    id: 109,
    title: "Recording Documents",
    type: "legal",
    description: `
      File the necessary documents with the appropriate government office to record the transaction.
    `,
  },
  {
    id: 110,
    title: "Payment Transactions",
    type: "legal",
    description: `
      Facilitate the transfer of funds and ensure all financial transactions are completed.
    `,
  },
  {
    id: 111,
    title: "Compliance with Building Codes",
    type: "legal",
    description: `
      Confirm that the building adheres to local building codes and regulations.
    `,
  },
  {
    id: 112,
    title: "Occupancy Permits",
    type: "legal",
    description: `
      Obtain any required occupancy permits or certificates.
    `,
  },
  {
    id: 113,
    title: "Notarization",
    type: "legal",
    description: `
      Ensure that relevant documents are properly notarized.
    `,
  },
  {
    id: 114,
    title: "Communication with Stakeholders",
    type: "legal",
    description: `
      Maintain open communication with buyers, sellers, agents, and legal representatives throughout the process.
    `,
  },
  {
    id: 115,
    title: "Post-Closing Documentation",
    type: "legal",
    description: `
      Organize and store all completed documentation for future reference.
    `,
  },

  // ======================== architectural ========================
  {
    id: 116,
    title: "Site Analysis",
    type: "architectural",
    description: `
      Evaluate the site conditions,
      Consider environmental factors like sun orientation, wind patterns, and topography.
    `,
  },
  {
    id: 117,
    title: "Program Development",
    type: "architectural",
    description: `
      Define the purpose and functionality of the building.
      Understand space requirements for different functions.
    `,
  },
  {
    id: 118,
    title: "Conceptual Design",
    type: "architectural",
    description: `
      Develop initial design concepts.
      Explore various architectural forms and styles.
    `,
  },
  {
    id: 119,
    title: "Schematic Design",
    type: "architectural",
    description: `
      Refine the chosen concept.
      Develop preliminary floor plans and elevations.
    `,
  },
  {
    id: 120,
    title: "Design Development",
    type: "architectural",
    description: `
      Add more detail to the design.
      Develop sections and details.
      Consider structural and mechanical systems.
    `,
  },
  {
    id: 121,
    title: "Coordination with Consultants",
    type: "architectural",
    description: `
      Collaborate with structural, mechanical, and electrical engineers.
      Ensure all systems are integrated seamlessly.
    `,
  },
  {
    id: 122,
    title: "Regulatory Compliance",
    type: "architectural",
    description: `
      Ensure designs comply with local building codes and regulations.
      Obtain necessary permits.
    `,
  },
  {
    id: 123,
    title: "Construction Documents",
    type: "architectural",
    description: `
      Create detailed drawings for construction.
      Include floor plans, elevations, sections, and details.
    `,
  },
  {
    id: 124,
    title: "Material Specifications",
    type: "architectural",
    description: `
      Specify materials and finishes for construction.
      Consider sustainability and durability.
    `,
  },
  {
    id: 125,
    title: "Cost Estimation",
    type: "architectural",
    description: `
      Prepare a detailed cost estimate based on the design.
      Evaluate the project's financial feasibility.
    `,
  },
  {
    id: 126,
    title: "Contractor Selection",
    type: "architectural",
    description: `
      Assist in the selection of a general contractor.
      Review bids and proposals.
    `,
  },
  {
    id: 127,
    title: "Construction Administration",
    type: "architectural",
    description: `
      Address questions and clarifications during construction.
      Ensure that the construction aligns with the drawings.
    `,
  },
  {
    id: 128,
    title: "Quality Control",
    type: "architectural",
    description: `
      Monitor the quality of work during construction.
      Make site visits to ensure compliance with the drawings.
    `,
  },
  {
    id: 129,
    title: "As-Built Drawings",
    type: "architectural",
    description: `
      Document any changes made during construction.
      Create final as-built drawings.
    `,
  },
  {
    id: 130,
    title: "Project Closeout",
    type: "architectural",
    description: `
      Ensure all regulatory inspections are completed.
      Confirm that the building meets the client's requirements.
    `,
  },
  {
    id: 131,
    title: "Documentation and Archiving",
    type: "architectural",
    description: `
      Organize and archive all project-related documents.
      Create a comprehensive record for future reference.
    `,
  },
];
