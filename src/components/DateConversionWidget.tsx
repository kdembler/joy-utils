import { Component, createResource, createSignal } from 'solid-js'
import { Card } from './Card'
import { DateTime } from 'luxon'
import { Input } from './Input'

const BLOCKS_REGEX = /^\d*$/

type Reference = {
  block: number
  timestamp: number
}

const REFERENCE_FALLBACK: Reference = {
  block: 5053646,
  timestamp: 1701004344,
}

async function getLatestBlock(): Promise<Reference> {
  try {
    const response = await fetch('https://monitoring.joyutils.org/sidecar/blocks/head')
    if (!response.ok) {
      throw new Error('Bad response')
    }
    const json = await response.json()
    const block = parseInt(json.number)
    const timestampExtrinsic = json.extrinsics.find(
      (extrinsic: any) => extrinsic?.method?.method === 'set' && extrinsic?.method?.pallet === 'timestamp'
    )
    if (!timestampExtrinsic) {
      throw new Error('Failed to find timestamp extrinsic')
    }
    const timestamp = timestampExtrinsic.args?.now
    return { block, timestamp: Math.floor(parseInt(timestamp) / 1000) }
  } catch (e) {
    console.error('Failed to fetch latest block', e)
    return Promise.reject(e)
  }
}

export const DateConversionWidget: Component = () => {
  const [selectedDate, setSelectedDate] = createSignal<DateTime | null>(null)
  const [blockNumber, setBlockNumber] = createSignal('')
  const [referenceResource] = createResource(getLatestBlock, {
    initialValue: REFERENCE_FALLBACK,
  })

  const reference = () => {
    return referenceResource.state === 'ready' ? referenceResource() : REFERENCE_FALLBACK
  }

  const isBlocksValueValid = () => {
    return BLOCKS_REGEX.test(blockNumber())
  }

  const handleDateChange = (rawStringValue: string) => {
    if (rawStringValue === '') {
      setSelectedDate(null)
      setBlockNumber('')
      return
    }
    const date = DateTime.fromISO(rawStringValue)
    const timestamp = date.toSeconds()
    const timestampDelta = timestamp - reference().timestamp
    const blocksDelta = Math.floor(timestampDelta / 6)
    const blockNumber = reference().block + blocksDelta
    setSelectedDate(date)
    setBlockNumber(blockNumber.toString())
  }

  const handleBlockNumberChange = (rawStringValue: string) => {
    if (rawStringValue === '') {
      setSelectedDate(null)
      setBlockNumber('')
      return
    }

    if (!BLOCKS_REGEX.test(rawStringValue)) {
      return
    }

    setBlockNumber(rawStringValue)
    const blockNumber = parseInt(rawStringValue)
    const timestamp = (blockNumber - reference().block) * 6 + reference().timestamp
    const date = DateTime.fromSeconds(timestamp)
    setSelectedDate(date)
  }

  const blockHeightInfo = () => {
    return (
      <div>
        <span>Block height assuming 6s block time</span>
        <br />
        <span>Reference block: {reference().block}</span>
        <br />
        <span>Reference timestamp: {reference().timestamp}</span>
      </div>
    )
  }

  return (
    <Card title="Date ↔️ block conversion">
      <Input
        label="Date"
        info="Date in your local timezone"
        disableCopy
        type="date"
        value={selectedDate()?.toString().slice(0, 16) ?? ''}
        onChange={handleDateChange}
      />
      <Input
        label="Block height"
        info={blockHeightInfo()}
        value={blockNumber()}
        isInvalid={!isBlocksValueValid()}
        onChange={handleBlockNumberChange}
      />
    </Card>
  )
}
