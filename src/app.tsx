import type { Component } from 'solid-js'
import { TokenConversionWidget } from './components/TokenConversionWidget'
import { DurationConversionWidget } from './components/DurationConversionWidget'
import { tippy } from 'solid-tippy'

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      tippy: ReturnType<Parameters<typeof tippy>[1]>
    }
  }
}

const App: Component = () => {
  return (
    <div class="w-full h-[100vh] flex flex-col items-center py-16 px-4 gap-2 bg-gradient-to-tr from-gray-50 to-gray-300">
      <TokenConversionWidget />
      <DurationConversionWidget />
    </div>
  )
}

export default App
