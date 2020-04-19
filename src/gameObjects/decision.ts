import { CatStatus } from "./catStatus"

type Option = {
  label: string,
  action: () => void
}

export type Decision = {
  catStatuses: CatStatus[],
  optionA: Option,
  optionB: Option,
}