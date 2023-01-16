import { Component, createSignal } from 'solid-js'
import { Card } from './Card'
import { Input } from './Input'
import { TokenInput } from './TokenInput'

const DAYS_REGEX = /^\d*$/

export const SalaryConversionWidget: Component = () => {
  const [targetSalaryValue, setTargetSalaryValue] = createSignal(0n)
  const [daysValue, setDaysValue] = createSignal('')
  const [salaryPerBlockValue, setSalaryPerBlockValue] = createSignal(0n)

  const isDaysValueValid = () => {
    return DAYS_REGEX.test(daysValue())
  }

  const handleTargetSalaryChange = (hapiValue: bigint) => {
    setTargetSalaryValue(hapiValue)
    if (hapiValue === 0n) {
      setSalaryPerBlockValue(0n)
      return
    }

    const days = parseInt(daysValue())
    if (days === 0 || Number.isNaN(days)) {
      return
    }

    const blocks = days * 24 * 60 * 10
    const salaryPerBlock = hapiValue / BigInt(blocks)
    setSalaryPerBlockValue(salaryPerBlock)
  }

  const handleDaysValueChange = (rawStringValue: string) => {
    setDaysValue(rawStringValue)
    if (rawStringValue === '') {
      setSalaryPerBlockValue(0n)
      return
    }

    if (!DAYS_REGEX.test(rawStringValue)) {
      return
    }

    const days = parseInt(rawStringValue)
    if (days === 0) {
      setSalaryPerBlockValue(0n)
      return
    }

    const blocks = days * 24 * 60 * 10
    const salaryPerBlock = targetSalaryValue() / BigInt(blocks)
    setSalaryPerBlockValue(salaryPerBlock)
  }

  const handleSalaryPerBlockChange = (hapiValue: bigint) => {
    setSalaryPerBlockValue(hapiValue)
    if (hapiValue === 0n) {
      setTargetSalaryValue(0n)
      return
    }

    const days = parseInt(daysValue())
    if (days === 0 || Number.isNaN(days)) {
      return
    }

    const blocks = days * 24 * 60 * 10
    const targetSalary = hapiValue * BigInt(blocks)
    setTargetSalaryValue(targetSalary)
  }

  return (
    <Card title="Salary calculator">
      <div class="grid grid-cols-[2fr,1fr] gap-3">
        <TokenInput label="Salary in JOY" value={targetSalaryValue()} onChange={handleTargetSalaryChange} />
        <Input
          label="Per days"
          value={daysValue()}
          isInvalid={!isDaysValueValid()}
          onChange={handleDaysValueChange}
          placeholder="0"
        />
      </div>
      <TokenInput label="HAPIs per block" value={salaryPerBlockValue()} onChange={handleSalaryPerBlockChange} isHapi />
    </Card>
  )
}
