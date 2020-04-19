type Option = {
  label: string,
  action: () => void
}

export type Decision = {
  catStatus: CatStatus,
  optionA: Option,
  optionB: Option,
}

export enum CatStatus {
  Asleep,
  Awake
}