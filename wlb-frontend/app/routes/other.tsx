import type {MetaFunction} from "@remix-run/node";

import {consts} from "~/consts";

export const meta: MetaFunction = () => {
  return [
    consts.title("Other page"),
    consts.description,
  ];
};

export default function Other() {
  return (
    <div>
      Test
    </div>
  );
}
