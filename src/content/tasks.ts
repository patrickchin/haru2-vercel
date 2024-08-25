import { DesignTaskSpec } from "@/lib/types";

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
    id: 200,
    title: "Site Analysis",
    type: "architectural",
    description: `
      Evaluate the site conditions,
      Consider environmental factors like sun orientation, wind patterns, and topography.
    `,
  },
  {
    id: 201,
    title: "Program Development",
    type: "architectural",
    description: `
      Define the purpose and functionality of the building.
      Understand space requirements for different functions.
    `,
  },
  {
    id: 202,
    title: "Conceptual Design",
    type: "architectural",
    description: `
      Develop initial design concepts.
      Explore various architectural forms and styles.
    `,
  },
  {
    id: 203,
    title: "Schematic Design",
    type: "architectural",
    description: `
      Refine the chosen concept.
      Develop preliminary floor plans and elevations.
    `,
  },
  {
    id: 204,
    title: "Design Development",
    type: "architectural",
    description: `
      Add more detail to the design.
      Develop sections and details.
      Consider structural and mechanical systems.
    `,
  },
  {
    id: 205,
    title: "Coordination with Consultants",
    type: "architectural",
    description: `
      Collaborate with structural, mechanical, and electrical engineers.
      Ensure all systems are integrated seamlessly.
    `,
  },
  {
    id: 206,
    title: "Regulatory Compliance",
    type: "architectural",
    description: `
      Ensure designs comply with local building codes and regulations.
      Obtain necessary permits.
    `,
  },
  {
    id: 207,
    title: "Construction Documents",
    type: "architectural",
    description: `
      Create detailed drawings for construction.
      Include floor plans, elevations, sections, and details.
    `,
  },
  {
    id: 208,
    title: "Material Specifications",
    type: "architectural",
    description: `
      Specify materials and finishes for construction.
      Consider sustainability and durability.
    `,
  },
  {
    id: 209,
    title: "Cost Estimation",
    type: "architectural",
    description: `
      Prepare a detailed cost estimate based on the design.
      Evaluate the project's financial feasibility.
    `,
  },
  {
    id: 209,
    title: "Contractor Selection",
    type: "architectural",
    description: `
      Assist in the selection of a general contractor.
      Review bids and proposals.
    `,
  },
  {
    id: 211,
    title: "Construction Administration",
    type: "architectural",
    description: `
      Address questions and clarifications during construction.
      Ensure that the construction aligns with the drawings.
    `,
  },
  {
    id: 212,
    title: "Quality Control",
    type: "architectural",
    description: `
      Monitor the quality of work during construction.
      Make site visits to ensure compliance with the drawings.
    `,
  },
  {
    id: 213,
    title: "As-Built Drawings",
    type: "architectural",
    description: `
      Document any changes made during construction.
      Create final as-built drawings.
    `,
  },
  {
    id: 214,
    title: "Project Closeout",
    type: "architectural",
    description: `
      Ensure all regulatory inspections are completed.
      Confirm that the building meets the client's requirements.
    `,
  },
  {
    id: 215,
    title: "Documentation and Archiving",
    type: "architectural",
    description: `
      Organize and archive all project-related documents.
      Create a comprehensive record for future reference.
    `,
  },

  // ======================== structural ========================
  {
    id: 300,
    title: "Site Analysis",
    type: "structural",
    description: `
      Understand the site conditions and constraints.
      Analyze soil reports and geological information.
    `,
  },
  {
    id: 301,
    title: "Architectural Drawings Review",
    type: "structural",
    description: `
      Review architectural drawings to understand the overall design and layout of the building.
    `,
  },
  {
    id: 302,
    title: "Structural Analysis",
    type: "structural",
    description: `
      Perform structural analysis to determine loads and forces acting on the building.
      Consider factors like live loads, dead loads, wind loads, and seismic loads.
    `,
  },
  {
    id: 303,
    title: "Foundation Design",
    type: "structural",
    description: `
      Design the foundation based on the soil conditions and structural analysis.
      Include details such as footings, piles, and foundations.
    `,
  },
  {
    id: 304,
    title: "Structural System Design",
    type: "structural",
    description: `
      Determine the structural system (e.g., steel, concrete, wood) based on the project requirements.
      Design beams, columns, and other structural elements.
    `,
  },
  {
    id: 305,
    title: "Connection Details",
    type: "structural",
    description: `
      Specify connection details between structural elements.
      Include welding details, bolt sizes, and other relevant information.
    `,
  },
  {
    id: 306,
    title: "Load Path Analysis",
    type: "structural",
    description: `
      Ensure a clear and efficient load path from the roof to the foundation.
      Verify load transfers through beams, columns, and other components.
    `,
  },
  {
    id: 307,
    title: "Material Specifications",
    type: "structural",
    description: `
      Specify the materials to be used in the construction.
      Provide material specifications for concrete, steel, and other components.
    `,
  },
  {
    id: 308,
    title: "Drawings Preparation",
    type: "structural",
    description: `
      Create detailed structural drawings, including plans, sections, and elevations.
      Include dimensions, annotations, and labels for clarity.
    `,
  },
  {
    id: 309,
    title: "Detailing",
    type: "structural",
    description: `
      Add detailing for critical areas, such as beam-column joints and support conditions.
      Include reinforcement details for concrete elements.
    `,
  },
  {
    id: 310,
    title: "Coordination with Other Disciplines",
    type: "structural",
    description: `
      Coordinate with architects, MEP (Mechanical, Electrical, Plumbing) engineers, and other stakeholders.
      Ensure compatibility and integration of structural elements with other building systems.
    `,
  },
  {
    id: 311,
    title: "Code Compliance",
    type: "structural",
    description: `
      Ensure that the structural design complies with local building codes and regulations.
      Address any code-specific requirements for seismic design, wind resistance, etc.
    `,
  },
  {
    id: 312,
    title: "Review and Approval",
    type: "structural",
    description: `
      Review the structural drawings for accuracy and completeness.
      Seek approvals from relevant authorities and stakeholders.
    `,
  },
  {
    id: 313,
    title: "Construction Support",
    type: "structural",
    description: `
      Provide support during the construction phase for any clarifications or modifications.
      Respond to requests for information (RFIs) from the construction team.
    `,
  },
  {
    id: 314,
    title: "As-Built Drawings",
    type: "structural",
    description: `
      Prepare as-built drawings to document any changes made during construction.
      Update records to reflect the actual building configuration.
    `,
  },

  // ======================== mep ========================
  {
    id: 400,
    title: "Project Scope Definition",
    type: "mep",
    description: `
   - Understand the project requirements and scope.
   - Review architectural drawings and specifications.
  `,
  },
  {
    id: 401,
    title: "System Design",
    type: "mep",
    description: `
   - Design MEP systems based on project requirements.
   - Determine system capacities, layouts, and locations.
  `,
  },
  {
    id: 402,
    title: "Coordination with Other Disciplines",
    type: "mep",
    description: `
   - Collaborate with architects and structural engineers to ensure integration.
   - Resolve conflicts between different building systems.
  `,
  },
  {
    id: 403,
    title: "Code Compliance",
    type: "mep",
    description: `
   - Ensure that MEP designs comply with local building codes and regulations.
  `,
  },
  {
    id: 404,
    title: "Load Calculations",
    type: "mep",
    description: `
   - Perform calculations for heating, ventilation, air conditioning (HVAC), electrical loads, and plumbing demands.
  `,
  },
  {
    id: 405,
    title: "Equipment Selection",
    type: "mep",
    description: `
   - Select appropriate HVAC equipment, electrical panels, pumps, and plumbing fixtures.
  `,
  },
  {
    id: 406,
    title: "Ductwork and Piping Layout",
    type: "mep",
    description: `
   - Create layouts for ductwork and piping systems.
   - Size and design the distribution network.
  `,
  },
  {
    id: 407,
    title: "Electrical Wiring and Lighting Design",
    type: "mep",
    description: `
   - Plan electrical wiring layouts.
   - Design lighting systems for each area.
  `,
  },
  {
    id: 408,
    title: "Plumbing System Design",
    type: "mep",
    description: `
   - Design plumbing layouts for water supply and drainage.
   - Specify fixture locations and sizes.
  `,
  },
  {
    id: 409,
    title: "Fire Protection Systems",
    type: "mep",
    description: `
    - Include design for fire sprinklers and alarms if required.
  `,
  },
  {
    id: 410,
    title: "Energy Efficiency Considerations",
    type: "mep",
    description: `
    - Integrate energy-efficient solutions in HVAC and lighting systems.
  `,
  },
  {
    id: 411,
    title: "Documentation",
    type: "mep",
    description: `
    - Prepare detailed drawings, schematics, and specifications.
    - Include dimensions, materials, and installation details.
  `,
  },
  {
    id: 412,
    title: "Cost Estimation",
    type: "mep",
    description: `
    - Provide cost estimates for materials, labor, and equipment.
  `,
  },
  {
    id: 413,
    title: "Review and Approval",
    type: "mep",
    description: `
    - Submit drawings for internal and external reviews.
    - Obtain approvals from relevant authorities.
  `,
  },
  {
    id: 414,
    title: "Construction Support",
    type: "mep",
    description: `
    - Assist during the construction phase.
    - Respond to RFIs (Requests for Information) from contractors.
  `,
  },
  {
    id: 415,
    title: "As-Built Documentation",
    type: "mep",
    description: `
    - Update drawings to reflect any changes made during construction.
    - Provide accurate as-built documentation.
  `,
  },
  {
    id: 416,
    title: "Commissioning",
    type: "mep",
    description: `
    - Verify and test MEP systems for functionality.
    - Ensure proper operation and performance.
  `,
  },
  {
    id: 417,
    title: "Handover",
    type: "mep",
    description: `
    - Provide final documentation to the owner or facility manager.
    - Conduct training on system operations and maintenance.
  `,
  },
];
