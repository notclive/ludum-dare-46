type Option = {
  label: string,
  action: () => void
}

export type Decision = {
  catStatuses: CatStatus[],
  optionA: Option,
  optionB: Option,
}

export enum CatStatus {
  Asleep,
  Awake,
  Drinking,
  Eating,
  LickingSomething,
  Ill
}