import React from 'react';
import { motion } from 'framer-motion';
import ProcessCards, { Step } from './ProcessCards';
import Benefits from './Benefits';

function CenterProcess() {
  const steps: Step[] = [
    {
      title: 'Register Your Training Center',
      description: 'List your center online and attract more students.',
    },
    {
      title: 'Set Up Courses & Assign Instructors',
      description: 'Digitize your training programs for a wider audience.',
    },
    {
      title: 'Enable Secure Payments',
      description: 'Students enroll and pay securely, with funds directed to your center.',
    },
    {
      title: 'Manage Students & Deliver Training',
      description: 'Track student progress, provide resources, and engage with learners.',
    },
    {
      title: 'Grade Assessments & Certify Students',
      description: 'Issue official certificates upon course completion.',
    },
    {
      title: 'Expand & Grow Your Training Center',
      description: 'Reach students beyond your local area and scale your operations with ease.',
    },
  ];

  const benefits: string[] = [
    'More Students, More Revenue',
    'Automated Enrollment & Payments',
    'Scalable & Efficient',
  ];

  return (
    <>
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        className="m-6 text-3xl text-center text-natural-400"
      >
        Grow & Digitize Your Business!
      </motion.p>
      <ProcessCards steps={steps} />
      <Benefits points={benefits} color="blue" />
    </>
  );
}

export default CenterProcess;
