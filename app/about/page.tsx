import Image from "next/image"

import SimpleLayout from "@/components/layout"

import avatar from "@/app/assets/avatar2.png"

const people = [
  {
    name: 'Haru',
    role: 'Co-Founder / CEO',
    imageUrl: avatar,
  },
  {
    name: 'Patrick',
    role: 'Co-Founder / CTO',
    imageUrl: avatar,
  },
]

export default function Page() {
  return (
    <SimpleLayout>
      <section className="grow flex flex-col bg-gray-50 shadow-xl p-16 gap-12">
        
        <div className="mx-auto grid max-w-7xl gap-x-8 gap-y-20 px-6 lg:px-8 xl:grid-cols-3">
          <div className="max-w-2xl">
            <h2>Meet our leadership</h2>
            <p>
              Libero fames augue nisl porttitor nisi, quis. Id ac elit odio vitae elementum enim vitae ullamcorper
              suspendisse.
            </p>
          </div>
          <ul role="list" className="grid gap-x-8 gap-y-12 sm:grid-cols-2 sm:gap-y-16 xl:col-span-2">
            {people.map((person) => (
              <li key={person.name}>
                <div className="flex items-center gap-x-6">
                  <Image className="h-16 w-16 rounded-full" src={person.imageUrl} alt="" width={64} height={64} />
                  <div>
                    <h3>{person.name}</h3>
                    <p>{person.role}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SimpleLayout>
  )
}