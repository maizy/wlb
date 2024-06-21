import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {title: "WLB Ither"},
    {name: "description", content: "Work-Life Balance Tracker"},
  ];
};

export default function Other() {
  return (
    <div>
      Test
    </div>
  );
}
