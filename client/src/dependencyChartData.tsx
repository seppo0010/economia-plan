import { GraphData } from './plan'

const subjectsRect = {
  285: [361, 201, 129, 76],
  290: [361, 308, 129, 76],
  288: [361, 560, 129, 76],
  561: [360, 734, 129, 76],
  556: [550, 96, 129, 76],
  289: [509, 376, 129, 76],
  553: [509, 469, 129, 76],
  287: [551, 756, 129, 76],
  557: [550, 860, 129, 76],
  551: [740, 201, 129, 76],
  286: [740, 308, 129, 76],
  283: [740, 614, 129, 76],
  560: [740, 725, 129, 76],
  555: [914, 308, 129, 76],
  552: [914, 414, 129, 76],
  554: [914, 556, 129, 76],
  558: [914, 652, 129, 76],
  559: [914, 860, 129, 76],
};
const canDo = (subject: number | string, checked: Set<string>, graphData: GraphData) => {
  subject = subject.toString()
  if (checked.has(subject)) {
    return false;
  }
  const requirements = graphData.edges.filter((e) => e.to.toString() === subject).map((e) => e.from.toString())
  return requirements.every((requirement) => checked.has(requirement))
}
export { subjectsRect, canDo };
