import React from 'react';
import Scheduler from "./components/AppointmentModal";

const App: React.FC = () => {
  const appointments = [
    {
      id: '1',
      title: 'Team Meeting',
      description: 'Weekly sync',
      startTime: '2024-12-16T10:00:00Z',
      endTime: '2024-12-16T11:00:00Z',
      color: '#3b82f6'
    }
  ];

  return (
    <div className="p-4 h-screen">
      <Scheduler
        appointments={appointments}
        viewType="week"
        onAppointmentCreate={(appointment) => {
          console.log('Create:', appointment);
        }}
        onAppointmentUpdate={(appointment) => {
          console.log('Update:', appointment);
        }}
      />
    </div>
  );
};

export default App;