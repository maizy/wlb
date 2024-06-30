import React, {JSX} from "react";

const examples = `\
9-15 14-45
15:00 - 15:30
16 - 17
18`;

export function PeriodsExample(prop: {setWorkPeriodsSpec: React.Dispatch<React.SetStateAction<string>>}): JSX.Element {
  return (
    <div>
      Example:<br/>
      <button className="input-example"
           onClick={() => prop.setWorkPeriodsSpec(examples)}>
        {examples}
      </button>
    </div>
  );
}
