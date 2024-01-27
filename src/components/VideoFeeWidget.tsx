import { Component, createResource, createSignal } from 'solid-js'
import { Card } from './Card'
import { Input } from './Input'
import { formatUnits } from '@ethersproject/units'

type VideoFees = {
  dataObjectStateBloatBond: bigint
  dataObjectMegaByteFee: bigint
  videoStateBloatBond: bigint
}

async function getVideoFees(): Promise<VideoFees> {
  try {
    const responses = await Promise.all([
      fetch('https://monitoring.joyutils.org/sidecar/pallets/storage/storage/DataObjectStateBloatBondValue'),
      fetch('https://monitoring.joyutils.org/sidecar/pallets/storage/storage/DataObjectPerMegabyteFee'),
      fetch('https://monitoring.joyutils.org/sidecar/pallets/content/storage/VideoStateBloatBondValue'),
    ])
    if (!responses.every((response) => response.ok)) {
      throw new Error('Bad response')
    }
    const jsons = await Promise.all(responses.map((response) => response.json()))
    const dataObjectStateBloatBond = BigInt(jsons[0].value)
    const dataObjectMegaByteFee = BigInt(jsons[1].value)
    const videoStateBloatBond = BigInt(jsons[2].value)
    return { dataObjectStateBloatBond, dataObjectMegaByteFee, videoStateBloatBond }
  } catch (e) {
    console.error('Failed to fetch video fees', e)
    return Promise.reject(e)
  }
}

export const VideoFeeWidget: Component = () => {
  const [numberOfObjects, setNumberOfObjects] = createSignal('')
  const [totalObjectsSize, setTotalObjectsSize] = createSignal('')

  const [videoFeesResource] = createResource(getVideoFees)

  const videoFees = () => {
    return videoFeesResource.state === 'ready' ? videoFeesResource() : null
  }

  const isNumberOfObjectsValueValid = () => {
    return !numberOfObjects() || parseInt(numberOfObjects()) > 0
  }

  const isTotalObjectsSizeValueValid = () => {
    return !totalObjectsSize() || parseFloat(totalObjectsSize()) > 0
  }

  const handleNumberOfObjectsChange = (rawStringValue: string) => {
    setNumberOfObjects(rawStringValue)
  }

  const handleTotalObjectsSizeChange = (rawStringValue: string) => {
    setTotalObjectsSize(rawStringValue)
  }

  const videoFeesInfo = () => {
    const videoFeesValue = videoFees()
    const numberOfObjectsValue = parseInt(numberOfObjects())
    const totalObjectsSizeValue = parseFloat(totalObjectsSize())

    if (!(numberOfObjectsValue > 0 && totalObjectsSizeValue > 0)) {
      return <div />
    }

    if (!videoFeesValue) {
      return <div>Failed to fetch video fees. Please try again later.</div>
    }

    const totalDataObjectStateBloatBond = BigInt(numberOfObjectsValue) * videoFeesValue.dataObjectStateBloatBond
    const totalDataObjectMegaByteFee = BigInt(totalObjectsSizeValue) * videoFeesValue.dataObjectMegaByteFee

    const TX_FEE = 200000000n

    const totalVideoFees =
      TX_FEE + videoFeesValue.videoStateBloatBond + totalDataObjectStateBloatBond + totalDataObjectMegaByteFee

    const formatJoy = (value: bigint) => {
      const formatNumber = new Intl.NumberFormat('en-US', { minimumSignificantDigits: 2, maximumSignificantDigits: 2 })
        .format
      return formatNumber(parseFloat(formatUnits(value, 10))) + ' JOY'
    }

    return (
      <div class="text-slate-600 text-sm">
        <p>Transaction fee: {formatJoy(TX_FEE)}</p>
        <p>Video state bloat bond: {formatJoy(videoFeesValue.videoStateBloatBond)}</p>
        <p>
          Data object state bloat bond: {numberOfObjectsValue} * {formatJoy(videoFeesValue.dataObjectStateBloatBond)} ={' '}
          {formatJoy(totalDataObjectStateBloatBond)}
        </p>
        <p>
          Data object per megabyte fee: {totalObjectsSizeValue} * {formatJoy(videoFeesValue.dataObjectMegaByteFee)} ={' '}
          {formatJoy(totalDataObjectMegaByteFee)}
        </p>
        <p>
          Total video fees: <b>{formatJoy(totalVideoFees)}</b>
        </p>
        <p>
          Refundable on video deletion:{' '}
          <b>{formatJoy(videoFeesValue.videoStateBloatBond + totalDataObjectStateBloatBond)}</b>
        </p>
      </div>
    )
  }

  return (
    <Card title="Video fees">
      <Input
        label="Number of objects (media + images)"
        disableCopy
        isInvalid={!isNumberOfObjectsValueValid()}
        value={numberOfObjects()}
        onChange={handleNumberOfObjectsChange}
      />
      <Input
        label="Total object size (MB)"
        disableCopy
        isInvalid={!isTotalObjectsSizeValueValid()}
        value={totalObjectsSize()}
        onChange={handleTotalObjectsSizeChange}
      />
      {videoFeesInfo()}
    </Card>
  )
}
