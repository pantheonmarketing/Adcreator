import { LogoCloudsBlockDto } from "@/modules/pageBlocks/blocks/marketing/logoClouds/LogoCloudsBlockDto";
import LogoCloudsVariantCustom from "./LogoCloudsVariantCustom";
import LogoCloudsVariantSimple from "./LogoCloudsVariantSimple";
import LogoCloudsVariantWithHeading from "./LogoCloudsVariantWithHeading";

export default function LogoCloudsBlock({ item }: { item: LogoCloudsBlockDto }) {
  return (
    <>
      {item.style === "simple" && <LogoCloudsVariantSimple items={item.logos ?? []} />}
      {item.style === "withBrand" && <LogoCloudsVariantWithHeading headline={item.headline} items={item.logos ?? []} />}
      {item.style === "custom" && <LogoCloudsVariantCustom />}
    </>
  );
}
