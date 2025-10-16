import { useState, useEffect } from 'react';
import { getEmailConfig, saveEmailConfig, sendEmail, generateQuotationEmail } from '../lib/email';
import { listCustomers, getCompany } from '../lib/storage-simple';
import type { EmailConfig } from '../lib/email';

export default function EmailSettings() {
  const [config, setConfig] = useState<EmailConfig>({
    provider: 'smtp',
    fromEmail: '',
    fromName: '',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPass: ''
  });
  
  const [testEmail, setTestEmail] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const savedConfig = getEmailConfig();
    if (savedConfig) {
      setConfig(savedConfig);
    }
  }, []);

  const handleSave = () => {
    saveEmailConfig(config);
    alert('Email settings saved successfully!');
  };

  const handleTest = async () => {
    if (!testEmail) {
      alert('Please enter a test email address');
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const company = getCompany();
      const testTemplate = {
        subject: `Test Email from ${company.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Email Configuration Test</h2>
            <p>This is a test email to verify your email configuration is working correctly.</p>
            <p><strong>From:</strong> ${config.fromName} &lt;${config.fromEmail}&gt;</p>
            <p><strong>Provider:</strong> ${config.provider.toUpperCase()}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
              This email was sent from CHABS Inventory System
            </p>
          </div>
        `,
        text: `
          Email Configuration Test
          
          This is a test email to verify your email configuration is working correctly.
          
          From: ${config.fromName} <${config.fromEmail}>
          Provider: ${config.provider.toUpperCase()}
          Time: ${new Date().toLocaleString()}
          
          This email was sent from CHABS Inventory System
        `
      };

      const result = await sendEmail(testEmail, testTemplate);
      setTestResult(result);
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to send test email. Please check your configuration.'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center mb-2">
          📧 Email Configuration
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure email settings for sending quotations, orders, and notifications
        </p>
      </div>

      {/* Email Provider */}
      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Email Provider</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Provider
          </label>
          <select
            className="input"
            value={config.provider}
            onChange={(e) => setConfig({ ...config, provider: e.target.value as any })}
          >
            <option value="smtp">SMTP (Custom)</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Email *
            </label>
            <input
              type="email"
              required
              className="input"
              placeholder="noreply@yourcompany.com"
              value={config.fromEmail}
              onChange={(e) => setConfig({ ...config, fromEmail: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              From Name *
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="Your Company Name"
              value={config.fromName}
              onChange={(e) => setConfig({ ...config, fromName: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Provider-specific settings */}
      {config.provider === 'smtp' && (
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">SMTP Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Host *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="smtp.gmail.com"
                value={config.smtpHost}
                onChange={(e) => setConfig({ ...config, smtpHost: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SMTP Port *
              </label>
              <input
                type="number"
                required
                className="input"
                placeholder="587"
                value={config.smtpPort}
                onChange={(e) => setConfig({ ...config, smtpPort: parseInt(e.target.value) || 587 })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="your-email@gmail.com"
                value={config.smtpUser}
                onChange={(e) => setConfig({ ...config, smtpUser: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                required
                className="input"
                placeholder="App password or regular password"
                value={config.smtpPass}
                onChange={(e) => setConfig({ ...config, smtpPass: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-200 mb-2">📝 SMTP Setup Tips</h4>
            <ul className="text-sm text-blue-800 dark:text-blue-300 space-y-1">
              <li>• <strong>Gmail:</strong> Use smtp.gmail.com:587 with app password</li>
              <li>• <strong>Outlook:</strong> Use smtp-mail.outlook.com:587</li>
              <li>• <strong>Yahoo:</strong> Use smtp.mail.yahoo.com:587</li>
              <li>• Enable "Less secure app access" or use app passwords</li>
            </ul>
          </div>
        </div>
      )}

      {config.provider === 'sendgrid' && (
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">SendGrid Settings</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key *
            </label>
            <input
              type="password"
              required
              className="input"
              placeholder="SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">🚀 SendGrid Setup</h4>
            <ol className="text-sm text-green-800 dark:text-green-300 space-y-1">
              <li>1. Sign up at sendgrid.com</li>
              <li>2. Go to Settings → API Keys</li>
              <li>3. Create a new API key with "Mail Send" permissions</li>
              <li>4. Copy and paste the API key above</li>
            </ol>
          </div>
        </div>
      )}

      {config.provider === 'mailgun' && (
        <div className="card space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mailgun Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Key *
              </label>
              <input
                type="password"
                required
                className="input"
                placeholder="key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                value={config.apiKey || ''}
                onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Domain *
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="mg.yourcompany.com"
                value={config.domain || ''}
                onChange={(e) => setConfig({ ...config, domain: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <h4 className="font-medium text-orange-900 dark:text-orange-200 mb-2">📮 Mailgun Setup</h4>
            <ol className="text-sm text-orange-800 dark:text-orange-300 space-y-1">
              <li>1. Sign up at mailgun.com</li>
              <li>2. Add and verify your domain</li>
              <li>3. Go to Settings → API Keys</li>
              <li>4. Copy your Private API key and domain</li>
            </ol>
          </div>
        </div>
      )}

      {/* Test Email */}
      <div className="card space-y-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Test Configuration</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Test Email Address
          </label>
          <div className="flex gap-3">
            <input
              type="email"
              className="input flex-1"
              placeholder="test@example.com"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
            />
            <button
              onClick={handleTest}
              disabled={isTesting || !testEmail}
              className="btn btn-secondary"
            >
              {isTesting ? '📤 Sending...' : '🧪 Send Test'}
            </button>
          </div>
        </div>

        {testResult && (
          <div className={`p-4 rounded-lg border ${
            testResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
          }`}>
            <div className={`font-medium ${
              testResult.success 
                ? 'text-green-900 dark:text-green-200' 
                : 'text-red-900 dark:text-red-200'
            }`}>
              {testResult.success ? '✅ Test Email Sent!' : '❌ Test Failed'}
            </div>
            <div className={`text-sm mt-1 ${
              testResult.success 
                ? 'text-green-800 dark:text-green-300' 
                : 'text-red-800 dark:text-red-300'
            }`}>
              {testResult.message}
            </div>
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary px-8">
          💾 Save Email Settings
        </button>
      </div>
    </div>
  );
}