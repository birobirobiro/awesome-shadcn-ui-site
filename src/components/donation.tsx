import { Button } from "@/components/ui/button";
import BuyMeACoffeeLogo from "@/assets/BuyMyACoffee.svg";
import Image from "next/image";
import Link from "next/link";

export default function Donation() {
  return (
    <Link href="https://buymeacoffee.com/birobirobiro" target="_blank">
      <Button className="rounded-full p-4 fixed bottom-4 right-4 z-50 bg-[#ffe433]/90 hover:bg-[#ffe433] font-semibold transition-all duration-200">
        <Image
          src={BuyMeACoffeeLogo}
          alt="Buy me a coffee"
          width={30}
          height={30}
        />
        Buy me a coffee
      </Button>
    </Link>
  );
}
