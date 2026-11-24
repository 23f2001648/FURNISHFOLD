import { CategoryStrip } from "@/components/home/category-strip";
import { Featured } from "@/components/home/featured";
import { Hero } from "@/components/home/hero";
import { ValueProps } from "@/components/home/value-props";

export default function HomePage() {
  return (<><Hero /><ValueProps /><CategoryStrip /><Featured /></>);
}
