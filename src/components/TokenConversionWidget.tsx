import { Component, createSignal } from 'solid-js'
import { TokenInput } from './TokenInput'
import { Card } from './Card'

export const TokenConversionWidget: Component = () => {
  const [tokenValue, setTokenValue] = createSignal(0n)

  return (
    <Card title="JOY ↔️ HAPI conversion">
      <TokenInput label="JOY" value={tokenValue()} onChange={setTokenValue} />
      <TokenInput label="HAPI" isHapi value={tokenValue()} onChange={setTokenValue} />
    </Card>
  )
}
