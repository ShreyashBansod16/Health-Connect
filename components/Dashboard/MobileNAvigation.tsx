'use client'
import { useState } from 'react'
import RecentMedicalRecords from './RecentMedicalRecords'
import AppointmentSection from './AppointmentSection'

interface MobileTabsWrapperProps {
  user: any // Replace 'any' with your user type if available
}

export default function MobileTabsWrapper({ user }: MobileTabsWrapperProps) {
  const [activeTab, setActiveTab] = useState('records')
  
  return (
    <div>
      {/* Mobile Toggle Buttons */}
      <div className="lg:hidden grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActiveTab('records')}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'records'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Medical Records
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`py-2 px-4 rounded-lg font-semibold ${
            activeTab === 'appointments'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Appointments
        </button>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className={`w-full ${activeTab !== 'records' ? 'hidden lg:block' : ''}`}>
          <RecentMedicalRecords user={user} />
        </div>
        <div className={`w-full ${activeTab !== 'appointments' ? 'hidden lg:block' : ''}`}>
          <AppointmentSection user={user} />
        </div>
      </div>
    </div>
  )
}