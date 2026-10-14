import Link from "next/link";
import { CheckIcon } from "../../_components/svgs";
import { contactSalesBenefits } from "./contactSalesData";

export const ContactSalesBenefits = () => {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 text-left sm:gap-5 lg:h-full lg:min-w-0 lg:max-w-[560px] lg:justify-center lg:gap-8 lg:pl-4">
      <h1 className="text-3xl font-semibold leading-tight text-[#171717] sm:text-4xl lg:text-[clamp(2.75rem,3.6vw,3.5rem)] lg:font-bold lg:leading-[1.08]">
        Talk with our{" "}
        <span className="text-[#6f4ef6] lg:block">sales team</span>
      </h1>

      <p className="text-base text-[#4b4b4b] sm:text-lg lg:max-w-[480px] lg:text-[20px] lg:leading-[30px]">
        Get expert guidance to unlock the full potential of Zedu.
      </p>

      <ul className="ml-0 flex flex-col gap-2 text-sm leading-relaxed text-[#3f3f46] sm:ml-3 sm:gap-3 sm:text-base lg:max-w-[480px] lg:gap-[22px] lg:text-[17px] lg:leading-[25px]">
        {contactSalesBenefits.map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 lg:gap-4">
            <span className="mt-1 shrink-0 lg:flex lg:h-[30px] lg:w-[30px] lg:items-center lg:justify-center lg:rounded-lg lg:bg-[#6f4ef6]/10">
              <CheckIcon />
            </span>
            <span>{benefit}</span>
          </li>
        ))}
      </ul>

      <p className="text-sm text-[#595959] sm:text-base lg:max-w-[480px] lg:border-t lg:border-[#e6e3f5] lg:pt-8 lg:text-[#3f3f46]">
        Looking for product or customer support? Visit our{" "}
        <Link
          href="mailto:support@zedu.chat"
          className="text-[#6f4ef6] lg:underline lg:underline-offset-4"
        >
          Help Center.
        </Link>
      </p>
    </div>
  );
};
