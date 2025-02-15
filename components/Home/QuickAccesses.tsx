const specializations = [
    'Cardiologist',
    'Dentist',
    'Pediatrician',
    'Dermatologist',
    'Orthopedist',
    'Gynecologist',
    'Neurologist',
    'Ophthalmologist',
    'Psychiatrist',
    'Urologist',
  ]
  
  const popularDoctors = [
    { name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
    { name: 'Dr. Michael Lee', specialty: 'Pediatrics' },
    { name: 'Dr. Emily Chen', specialty: 'Dermatology' },
  ]
  
  const healthTopics = [
    'Dealing with Flu Season',
    'Importance of Mental Health',
    'Nutrition Tips for a Healthy Lifestyle',
    'Understanding Vaccinations',
  ]
  
  export default function QuickAccess() {
    return (
      <section className="bg-white dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Quick Access</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec) => (
                  <span key={spec} className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Popular Doctors</h3>
              <ul className="space-y-2">
                {popularDoctors.map((doctor) => (
                  <li key={doctor.name} className="text-gray-600 dark:text-gray-300">
                    {doctor.name} - <span className="text-blue-600 dark:text-blue-400">{doctor.specialty}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Health Topics</h3>
              <ul className="space-y-2">
                {healthTopics.map((topic) => (
                  <li key={topic} className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  