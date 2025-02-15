"use client"

import Image from "next/image"

const testimonials = [
  {
    name: "Jane D.",
    image: "/download.jpg",
    role: "Patient",
    text: "This platform helped me find a doctor quickly and easily! The interface is intuitive and I got an appointment within hours.",
  },
  {
    name: "Dr. John S.",
    image: "/dr1.jpg",
    role: "Healthcare Provider",
    text: "The symptom checker gave my patients peace of mind when they needed it most. A great tool for preliminary assessments.",
  },
  {
    name: "Neymar Jr.",
    image: "/Neymar.jpg",
    role: "Regular User",
    text: "Booking appointments has never been easier. The reminders and follow-up system are incredibly helpful!",
  },
]

export default function Testimonials() {
  return (
    <section className="bg-blue-50 dark:bg-gray-900 overflow-hidden">
      <div className="relative max-w-7xl mx-auto pt-20 pb-12 px-4 sm:px-6 lg:px-8 lg:py-20">
        <div className="relative lg:flex lg:items-center">
          <div className="hidden lg:block lg:flex-shrink-0">
            <div className="relative h-80 w-80 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
              <Image
                className="object-cover"
                src={testimonials[0].image || "/placeholder.svg"}
                alt="Healthcare professional with patient"
                fill
                sizes="(min-width: 1024px) 320px, 0px"
                priority
              />
            </div>
          </div>

          <div className="relative lg:ml-10">
            <svg
              className="absolute top-0 left-0 transform -translate-x-8 -translate-y-24 h-36 w-36 text-blue-200 dark:text-blue-800 opacity-50"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 144 144"
              aria-hidden="true"
            >
              <path
                strokeWidth={2}
                d="M41.485 15C17.753 31.753 1 59.208 1 89.455c0 24.664 14.891 39.09 32.109 39.09 16.287 0 28.386-13.03 28.386-28.387 0-15.356-10.703-26.524-24.663-26.524-2.792 0-6.515.465-7.446.93 2.327-15.821 17.218-34.435 32.11-43.742L41.485 15zm80.04 0c-23.268 16.753-40.02 44.208-40.02 74.455 0 24.664 14.891 39.09 32.109 39.09 15.822 0 28.386-13.03 28.386-28.387 0-15.356-11.168-26.524-25.129-26.524-2.792 0-6.049.465-6.98.93 2.327-15.821 16.753-34.435 31.644-43.742L121.525 15z"
              />
            </svg>
            <div className="relative">
              <div className="text-2xl leading-9 font-medium text-gray-900 dark:text-white">
                <p>&ldquo;{testimonials[0].text}&rdquo;</p>
              </div>
              <footer className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0 lg:hidden">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900">
                      <Image
                        src={testimonials[0].image || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  </div>
                  <div className="ml-4 lg:ml-0">
                    <div className="text-base font-medium text-gray-900 dark:text-white">{testimonials[0].name}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">{testimonials[0].role}</div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {testimonials.slice(1).map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-blue-100 dark:border-blue-900"
            >
              <div className="p-8">
                <div className="text-lg leading-7 font-medium text-gray-900 dark:text-white">
                  &ldquo;{testimonial.text}&rdquo;
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-blue-100 dark:ring-blue-900">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

