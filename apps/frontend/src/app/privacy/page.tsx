
"use client";

import React from 'react';
import { PrivacyPolicy } from '../components/PrivacyPolicy';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <PrivacyPolicy showActions={false} />
    </div>
  );
}
