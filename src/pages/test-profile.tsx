import React from "react";
import { ExpertProfileManager } from "../components/expert/ProfileManager";

// Test page to verify profile components without authentication
const TestProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Profile Component Test
          </h1>
          <p className="text-gray-600">
            Testing the expert profile manager components
          </p>
        </div>

        <ExpertProfileManager />
      </div>
    </div>
  );
};

export default TestProfilePage;
