import { CommunityBlockDto } from "./CommunityBlockDto";
import CommunityVariantSimple from "./CommunityVariantSimple";

export default function CommunityBlock({ item }: { item: CommunityBlockDto }) {
  return <>{item.style === "simple" && <CommunityVariantSimple item={item} />}</>;
}
