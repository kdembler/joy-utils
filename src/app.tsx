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
    <div class="flex flex-col min-h-[100vh]">
      <main class="flex-1 w-full py-16 px-4 flex flex-col items-center ">
        <h1 class="text-2xl font-semibold">Joystream Utils</h1>
        <div class="max-w-[1024px] mt-5 sm:mt-20 gap-x-8 gap-y-15 m-auto grid sm:grid-cols-layout items-center justify-items-center">
          <TokenConversionWidget />
          <DurationConversionWidget />
          <DateConversionWidget />
          <SalaryConversionWidget />
        </div>
      </main>
      <footer class="text-gray-500 text-xs bg-gray-50 shadow w-full flex flex-col items-center justify-center py-3 border-t gap-2">
        <span>Made by klaudiusz.eth</span>
        <a
          href="https://github.com/kdembler/joy-utils/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:underline"
        >
          Report an issue
        </a>
      </footer>
    </div>
  )
}

export default App
