import React from 'react';
import { motion } from 'framer-motion';
import ProcessCards, { Step } from './ProcessCards';
import Benefits from './Benefits';

function StudentProcess() {
  const steps: Step[] = [
    {
      title: 'Register as a Student',
      description:
        'Sign up online from the comfort of your home, no need to visit a physical location.',
    },
    {
      title: 'Choose a Training Center & Course',
      description:
        'Browse accredited training centers and select a course that fits your schedule.',
    },
    {
      title: 'Make a Secure Payment',
      description: 'Use Paystack to enroll instantly without paperwork or delays.',
    },
    {
      title: 'Access Your Moodle Account',
      description: 'Get immediate access to your coursework, video lessons, and assignments.',
    },
    {
      title: 'Attend Classes & Take Assessments',
      description: 'Study at your own pace or join live sessions with expert instructors.',
    },
    {
      title: 'Get Certified!',
      description:
        'Earn an official security training certificate without ever needing to leave home.',
    },
  ];

  const benefits: string[] = [
    'Flexible & Convenient',
    'No Travel Required',
    'Accredited & Recognized Certification',
  ];

  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className="m-6 text-3xl text-center text-natural-400"
      >
        Learn From Anywhere!
      </motion.p>
      <ProcessCards steps={steps} />
      <Benefits points={benefits} color="green" />
    </>
  );
}

export default StudentProcess;
