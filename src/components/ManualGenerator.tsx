import { ManualGenerator } from '../lib/manual-generator';

export default function ManualGeneratorComponent() {
  const generateManual = () => {
    const generator = new ManualGenerator();
    generator.generateUserManual();
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Generate User Manual
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Create a comprehensive PDF manual covering everything about your CHABS system
        </p>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Manual Includes:</h3>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>✓ Complete system overview in simple terms</li>
            <li>✓ Step-by-step user guides</li>
            <li>✓ Troubleshooting solutions</li>
            <li>✓ Maintenance procedures</li>
            <li>✓ Client presentation materials</li>
            <li>✓ Technical notes for developers</li>
          </ul>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Perfect For:</h3>
          <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <li>• Business owners with no technical background</li>
            <li>• Training new staff members</li>
            <li>• Presenting to potential clients</li>
            <li>• System administrators</li>
            <li>• Support documentation</li>
          </ul>
        </div>

        <button
          onClick={generateManual}
          className="btn btn-primary px-8 py-3 text-lg"
        >
          📄 Generate Complete Manual PDF
        </button>

        <p className="text-xs text-gray-500">
          The manual will be automatically downloaded as a PDF file
        </p>
      </div>
    </div>
  );
}