import { CenteredLayout } from "@/components/page-layouts";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const services = [
  {
    name: "Site Layout and Access",
    description: [
      "Site Plans: Detailed layout, including entrances, exits, and key areas (e.g., offices, storage, work zones).",
      "Access Routes: How to access the site, parking facilities, and any restrictions.",
      "Nearby Infrastructure: Location of utilities, roads, and other infrastructure that might affect the site.",
    ],
    price: 0,
  },
  {
    name: "Current Construction Activities",
    description: [
      "Work Schedule: Ongoing tasks, milestones, and upcoming phases of the project.",
      "Daily Operations: Specific activities planned for the day of the visit.",
      "Hazards and Risks: Any high-risk activities (e.g., heavy lifting, working at heights) scheduled for that day.",
    ],
    price: 0,
  },
  {
    name: "Health and Safety",
    description: [
      "Safety Protocols: Site-specific safety rules, emergency procedures, and PPE requirements.",
      "Emergency Exits and Assembly Points: Locations in case of an emergency.",
      "First Aid Stations: Location and accessibility.",
    ],
    price: 0,
  },
  {
    name: "Site Personnel Report",
    description: [
      "Key Contacts: Names and roles of the site manager, foreman, health and safety officer, and other key personnel.",
      "Number of Workers: Expected number of workers on site during the visit.",
      "Subcontractors: Details of subcontractors working on site and their scope of work.",
    ],
    price: 10,
  },
  {
    name: "Site Conditions Report",
    description: [
      "Weather Forecast: Expected weather conditions that might affect site operations.",
      "Ground Conditions: Information on soil, foundation, and any issues like waterlogging or instability.",
      "Utilities: Availability of power, water, and other essential services.",
    ],
    price: 30,
  },
  {
    name: "Site Documentation",
    description: [
      "Permits and Approvals: Any permits required for ongoing work, including environmental and safety approvals.",
      "Inspection Reports: Recent inspections or audits related to safety, quality, or compliance.",
      "Plans and Drawings: Latest architectural, structural, and MEP drawings.",
    ],
    price: 0,
  },
  {
    name: "Materials and Equipment",
    description: [
      "Material Deliveries: Schedule of deliveries and storage locations.",
      "Equipment on Site: List of machinery and equipment, including cranes, excavators, and safety equipment.",
    ],
    price: 0,
  },
  {
    name: "Site Security Report",
    description: [
      "Site Security Measures: Security protocols, fencing, CCTV, and guard details.",
      "Visitor Protocols: Procedures for visitor registration, site induction, and access control.",
    ],
    price: 0,
  },
  {
    name: "Legal and Compliance Issues",
    description: [
      "Regulations: Applicable local, state, or national regulations that the site must adhere to.",
      "Disputes or Claims: Any ongoing legal issues, disputes, or claims related to the project.",
    ],
    price: 0,
  },
  {
    name: "Environmental Considerations",
    description: [
      "Waste Management: Waste disposal procedures and environmental impact mitigation strategies.",
      "Noise and Dust Control: Measures in place to manage environmental nuisances.",
    ],
    price: 0,
  },
  {
    name: "Communication Protocols",
    description: [
      "Reporting Structure: How information is communicated on site and who reports to whom.",
      "Meeting Schedules: Regular site meetings and briefings the supervisor should attend.",
    ],
    price: 0,
  },
  {
    name: "Visitor and Public Interaction",
    description: [
      "Community Relations: Any issues or complaints from the local community.",
      "Public Safety Measures: Fencing, signage, and other measures to protect the public.",
    ],
    price: 0,
  },
  {
    name: "Budget and Timeline",
    description: [
      "Project Budget: Current budget status and any financial constraints.",
      "Timeline: Progress against the project timeline, including any delays.",
    ],
    price: 0,
  },
];

export default function Page() {
  return (
    <CenteredLayout>
      <h2>Site Analysis Services</h2>
      <section className="w-full">
        <ul className="w-full grid grid-cols-3 gap-4">
          {services.map((s, i) => {
            const id = s.name.replaceAll(" ", "-").toLowerCase();
            return (
              <li
                key={i}
                className="flex flex-col p-4 border rounded rounded-lg space-y-3 bg-background shadow"
              >
                <Label
                  htmlFor={id}
                  className="flex justify-between items-center cursor-pointer"
                >
                  <h5>{s.name}</h5>
                  <Switch id={id} defaultChecked={true} />
                </Label>
                <Separator />
                <ul className="grow pl-5">
                  {s.description.map((d, j) => (
                    <li
                      key={`${i}-${j}`}
                      className="list-disc text-balanced text-sm"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
                <Separator />
                <div>Price per Month: {s.price}</div>
              </li>
            );
          })}
        </ul>
      </section>
    </CenteredLayout>
  );
}
