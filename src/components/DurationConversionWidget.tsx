import { Component, createSignal } from 'solid-js'
import { Card } from './Card'
import { Input } from './Input'
import { Duration } from 'luxon'

const DURATION_REGEX = /^(?:(\d+)[Yy])?(?:(\d+)M)?(?:(\d+)[Dd])?T?(?:(\d+)[Hh])?(?:(\d+)m)?(?:(\d+)[Ss])?$/
const BLOCKS_REGEX = /^\d*$/

export const DurationConversionWidget: Component = () => {
  const [durationValue, setDurationValue] = createSignal('')
  const [blocksValue, setBlocksValue] = createSignal('')

  const isDurationValueValid = () => {
    return DURATION_REGEX.test(durationValue())
  }

  const isBlocksValueValid = () => {
    // only allow numbers
    return BLOCKS_REGEX.test(blocksValue())
  }

  const handleDurationInput = (rawStringValue: string) => {
    setDurationValue(rawStringValue)
    if (rawStringValue === '') {
      setBlocksValue('')
      return
    }

    if (!DURATION_REGEX.test(rawStringValue)) {
      return
    }

    const [, years, months, days, hours, minutes, seconds] = DURATION_REGEX.exec(rawStringValue) as RegExpExecArray

    const duration = Duration.fromObject({
      years: years ? parseInt(years) : undefined,
      months: months ? parseInt(months) : undefined,
      days: days ? parseInt(days) : undefined,
      hours: hours ? parseInt(hours) : undefined,
      minutes: minutes ? parseInt(minutes) : undefined,
      seconds: seconds ? parseInt(seconds) : undefined,
    })

    const numberOfBlocks = Math.ceil(duration.as('seconds') / 6)
    setBlocksValue(numberOfBlocks.toString())
  }
  const handleBlocksInput = (rawStringValue: string) => {
    setBlocksValue(rawStringValue)
    if (rawStringValue === '') {
      setDurationValue('')
      return
    }

    if (!BLOCKS_REGEX.test(rawStringValue)) {
      return
    }

    const numberOfBlocks = parseInt(rawStringValue)
    const duration = Duration.fromObject({ seconds: numberOfBlocks * 6 }).shiftTo(
      'years',
      'months',
      'days',
      'hours',
      'minutes',
      'seconds'
    )
    const formattedDuration = `${duration.years ? duration.years + 'y' : ''}${
      duration.months ? duration.months + 'M' : ''
    }${duration.days ? duration.days + 'd' : ''}${duration.hours ? duration.hours + 'h' : ''}${
      duration.minutes ? duration.minutes + 'm' : ''
    }${duration.seconds ? duration.seconds + 's' : ''}`

    setDurationValue(formattedDuration)
  }

  return (
    <Card title="Duration ↔️ blocks conversion">
      <Input
        label="Duration"
        info={
          <div>
            <span>Modified ISO 8601 duration</span>
            <br />
            <br />
            <span>Following tokens can be used:</span>
            <ul>
              <li>Y/y - years</li>
              <li>M - months</li>
              <li>D/d - days</li>
              <li>H/h - hours</li>
              <li>m - minutes</li>
              <li>S/s - seconds</li>
            </ul>
            <span>Example: 1y2M3d4h5m6s</span>
            <br />
            <br />
            <span>Blocks are rounded up</span>
          </div>
        }
        placeholder="5h30m"
        value={durationValue()}
        onChange={handleDurationInput}
        isInvalid={!isDurationValueValid()}
      />
      <Input
        label="Blocks"
        placeholder="0"
        value={blocksValue()}
        onChange={handleBlocksInput}
        isInvalid={!isBlocksValueValid()}
      />
    </Card>
  )
}
