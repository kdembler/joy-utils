import { ParentComponent } from 'solid-js'

type CardProps = {
  title: string
}

export const Card: ParentComponent<CardProps> = (props) => {
  return (
    <div class="overflow-hidden bg-white rounded-lg shadow w-full sm:w-100">
      <div class="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 class="text-lg font-medium leading-6 text-gray-900">{props.title}</h3>
      </div>
      <div class="px-4 sm:px-6 py-6 flex flex-col gap-5">{props.children}</div>
    </div>
  )
}
