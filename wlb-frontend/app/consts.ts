const projectName = "Work-Life Balance Tracker"
export const consts = {
  version: "v0.3-beta",
  projectName,
  description: {name: "description", content: projectName},
  title: (subtitle: undefined | string = undefined): {title: string} =>
    ({title: `WLB${subtitle !== undefined ? " • " + subtitle: ""}`})
}
