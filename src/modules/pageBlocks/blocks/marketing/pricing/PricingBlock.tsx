import { PricingBlockDto } from "./PricingBlockDto";
import PricingVariantSimple from "./PricingVariantSimple";

export default function PricingBlock({ item }: { item: PricingBlockDto }) {
  return <>{item.style === "simple" && <PricingVariantSimple item={item} />}</>;
}
