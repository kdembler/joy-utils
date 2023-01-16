import { Component, createEffect, createSignal } from 'solid-js'
import { parseUnits, formatUnits } from '@ethersproject/units'
import { Input } from './Input'

type TokenInputProps = {
  value: bigint
  onChange: (value: bigint) => void
  isHapi?: boolean
  label: string
  class?: string
}

const JOY_INPUT_REGEX = /^(\d+)?(\.\d*)?$/
const HAPI_INPUT_REGEX = /^(\d+)?$/

export const TokenInput: Component<TokenInputProps> = (props) => {
  const [internalValue, setInternalValue] = createSignal('')
  let expectValueUpdateRef = false

  const isValueValid = () => {
    const regex = props.isHapi ? HAPI_INPUT_REGEX : JOY_INPUT_REGEX
    return regex.test(internalValue())
  }

  // react to external value changes
  createEffect(() => {
    // access props so they always get tracked
    const value = props.value
    const isHapi = props.isHapi

    if (expectValueUpdateRef) {
      expectValueUpdateRef = false
      return
    }

    if (!value || value === 0n) {
      setInternalValue('')
      return
    }

    setInternalValue(formatUnits(value, isHapi ? 0 : 10))
  })

  const handleInput = (rawStringValue: string) => {
    if (rawStringValue === '') {
      expectValueUpdateRef = true
      setInternalValue('')
      props.onChange(0n)
      return
    }

    rawStringValue = rawStringValue.replaceAll(',', '.')
    expectValueUpdateRef = true
    setInternalValue(rawStringValue)

    try {
      const hapiValue = parseUnits(rawStringValue, props.isHapi ? 0 : 10).toBigInt()
      props.onChange(hapiValue)
    } catch {
      // ignore
    }
  }

  return (
    <Input
      label={props.label}
      isInvalid={!isValueValid()}
      placeholder="0"
      value={internalValue()}
      onChange={handleInput}
    />
  )
}
