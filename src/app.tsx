import type { Component } from 'solid-js'
import { TokenConversionWidget } from './components/TokenConversionWidget'
import { DurationConversionWidget } from './components/DurationConversionWidget'
import { DateConversionWidget } from './components/DateConversionWidget'
import { tippy } from 'solid-tippy'
import { SalaryConversionWidget } from './components/SalaryConversionWidget'

declare module 'solid-js' {
  namespace JSX {
    interface Directives {
      tippy: ReturnType<Parameters<typeof tippy>[1]>
    }
  }
}

const App: Component = () => {
  return (
    <main class="w-full min-h-[100vh] py-16 px-4 flex flex-col items-center bg-gradient-to-tr from-gray-50 to-gray-300">
      <h1 class="text-2xl font-semibold">Joystream Utils</h1>
      <div class="max-w-[1024px] mt-5 sm:mt-20 gap-x-8 gap-y-15 m-auto grid sm:grid-cols-layout items-center justify-items-center">
        <TokenConversionWidget />
        <DurationConversionWidget />
        <DateConversionWidget />
        <SalaryConversionWidget />
      </div>
    </main>
  )
}

export default App
