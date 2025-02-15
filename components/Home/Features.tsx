import { SearchIcon, ClipboardCheckIcon, CalendarIcon, BookOpenIcon } from 'lucide-react'

const features = [
  {
    name: 'Doctor Search',
    description: 'Find specialists by location and expertise.',
    icon: SearchIcon,
  },
  {
    name: 'Symptom Checker',
    description: 'Get AI-driven health advice based on your inputs.',
    icon: ClipboardCheckIcon,
  },
  {
    name: 'Appointment Booking',
    description: 'Book online or in-clinic appointments instantly.',
    icon: CalendarIcon,
  },
  {
    name: 'Health Tips',
    description: 'Explore articles and tips on staying healthy.',
    icon: BookOpenIcon,
  },
]

export default function Features() {
  return (
    <div className="py-12 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to manage your health
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
            Our platform offers a comprehensive set of tools to help you take control of your health journey.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}

