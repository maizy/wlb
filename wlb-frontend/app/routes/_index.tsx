import type {MetaFunction} from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    {title: "WLB"},
    {name: "description", content: "Work-Life Balance Tracker"},
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">WLB</h1>
      <p>TODO</p>
      <a href="/other">Other</a>
    </div>
  );
}
