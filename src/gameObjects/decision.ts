type Option = {
  label: string,
  action: () => void
}

export type Decision = {
  optionA: Option,
  optionB: Option,
}
