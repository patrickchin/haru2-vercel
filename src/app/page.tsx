import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LucideMoveRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";

const bgblur =
  "data:image/bmp;base64," +
  "Qk2aAwAAAAAAAIoAAAB8AAAACgAAAAcAAAABABgAAAAAAOAAAAByJgAAciYAAAAA" +
  "AAAAAAAAAAD/AAD/AAD/AAAAAAAA/0RFQk2PwvUoUbgeFR6F6wEzMzMTZmZmJmZm" +
  "ZgaZmZkJPQrXAyhcjzIAAAAAAAAAAAAAAAAEAAAAXAEAADACAAAAAAAAPy4sRDEt" +
  "KRweSjw9nqq9ma/Ppq62vsXHj5OWlZygAABJNC49KyY3LTRsaXO9xMqsvtu6wsu3" +
  "v8J/gYGSmJsAAGtYUUUxLEhFUZ2fotvf4Li5upuhqbfCzoSIjJeeogAAxcTGS0RK" +
  "SUpdnaa30tjZt7m7nqWrs7/JeHyAjJSZAADb4OSGg4UuLkF8l7Pc3ty2ur6FjJOD" +
  "i5JzdnltdHoAANa9qebp68TGya2zuNfa3LO2uJugpYSNknR4fH+JkgAA0p5z5Mu3" +
  "6+flsrO21NfYtrq+r7KzoaitdXyCrbS5AAAAAAIwQURCRQIQAABtbnRyUkdCIFhZ" +
  "WiAHzwAGAAMAAAAAAABhY3NwQVBQTAAAAABub25lAAAAAAAAAAAAAAAAAAAAAAAA" +
  "9tYAAQAAAADTLUFEQkUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAApjcHJ0AAAA/AAAADJkZXNjAAABMAAAAGt3dHB0AAABnAAA" +
  "ABRia3B0AAABsAAAABRyVFJDAAABxAAAAA5nVFJDAAAB1AAAAA5iVFJDAAAB5AAA" +
  "AA5yWFlaAAAB9AAAABRnWFlaAAACCAAAABRiWFlaAAACHAAAABR0ZXh0AAAAAENv" +
  "cHlyaWdodCAxOTk5IEFkb2JlIFN5c3RlbXMgSW5jb3Jwb3JhdGVkAAAAZGVzYwAA" +
  "AAAAAAARQWRvYmUgUkdCICgxOTk4KQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +
  "AAAAAAAAWFlaIAAAAAAAAPNRAAEAAAABFsxYWVogAAAAAAAAAAAAAAAAAAAAAGN1" +
  "cnYAAAAAAAAAAQIzAABjdXJ2AAAAAAAAAAECMwAAY3VydgAAAAAAAAABAjMAAFhZ" +
  "WiAAAAAAAACcGAAAT6UAAAT8WFlaIAAAAAAAADSNAACgLAAAD5VYWVogAAAAAAAA" +
  "JjEAABAvAAC+nA==";

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="grow flex flex-col justify-center items-center relative">
        <div className="grid grid-cols-1 absolute h-full w-full -z-10">
          {/* <div className="h-full bg-gradient-to-br from-cyan-100 to-indigo-200 hover:bg-none"></div> */}
          <Image
            src="/bg.jpg"
            alt="background"
            loading="eager"
            blurDataURL={bgblur}
            placeholder="blur"
            fill={true}
            className="object-cover object-center"
          />
        </div>

        <div className="flex flex-col gap-16 max-w-[90rem] w-full lg:w-4/5 justify-end transition-all">
          <div className="flex justify-end">
            <h1
              className={cn(
                "lg:text-right text-4xl lg:text-6xl font-extrabold p-10 rounded",
                "bg-background/50 backdrop-blur-md",
              )}
            >
              Your Construction Projects, <br />
              Seamlessly Supervised
            </h1>
          </div>

          <div className="flex justify-end">
            <p
              className={cn(
                "text-right font-bold p-10 rounded",
                "bg-background/50 backdrop-blur-md",
              )}
            >
              <span className="whitespace-nowrap pr-2">
                Hire our Site Analysis Professionals
              </span>
              <Button
                asChild
                className="w-fit font-bold text-base [&_svg]:size-8"
              >
                <Link href="/sites">
                  Get Started
                  <LucideMoveRight className="ml-1" />
                </Link>
              </Button>
            </p>
          </div>
        </div>
      </main>
      {/* <Footer /> */}
    </div>
  );
}
