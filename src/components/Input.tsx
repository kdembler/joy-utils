import { Component, createSignal, JSX } from 'solid-js'
import classNames from 'classnames'
import { FiCheck, FiCopy, FiInfo } from 'solid-icons/fi'
import { tippy } from 'solid-tippy'
import 'tippy.js/dist/tippy.css'
import { Content } from 'tippy.js'

// so the tippy import is not removed by the bundler
false && tippy

type InputProps = {
  label: string
  placeholder?: string
  info?: JSX.Element
  isInvalid?: boolean
  value: string
  class?: string
  onChange: (value: string) => void
}

export const Input: Component<InputProps> = (props) => {
  const [isJustCopied, setIsJustCopied] = createSignal(false)

  const handleCopyClick = () => {
    navigator.clipboard.writeText(props.value)
    setIsJustCopied(true)
    setTimeout(() => setIsJustCopied(false), 2000)
  }

  return (
    <div class={classNames('flex flex-col', props.class)}>
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">{props.label}</label>
        {props.info && (
          <div
            use:tippy={{
              props: {
                content: props.info as Content,
                trigger: 'mouseenter focus',
                theme: 'light',
                interactive: true,
              },
            }}
            tabIndex={0}
          >
            <FiInfo />
          </div>
        )}
      </div>
      <div class="mt-1 relative">
        <input
          type="text"
          class={classNames(
            'relative mt-1 w-full min-w-0 flex-1 border rounded-md px-3 py-2 sm:text-lg focus:outline-none',
            props.isInvalid
              ? 'border-red-500 focus-within:border-red-500 text-red-500'
              : 'border-gray-300 focus-within:border-blue-600'
          )}
          placeholder={props.placeholder}
          value={props.value}
          onInput={(e) => props.onChange(e.currentTarget.value)}
        />
        <div class="absolute mt-1 right-0 top-0 bottom-0 right-2 flex items-center justify-center pointer-events-none">
          <button
            class="px-2 py-1 bg-gray-50 opacity-60 hover:opacity-90 active:opacity-100 rounded-md text-gray-500 flex items-center justify-center pointer-events-auto"
            onClick={handleCopyClick}
            use:tippy={{
              props: {
                content: 'Copied!',
                trigger: 'manual',
              },
              hidden: !isJustCopied(),
            }}
          >
            {isJustCopied() ? <FiCheck /> : <FiCopy />}
          </button>
        </div>
      </div>
    </div>
  )
}
