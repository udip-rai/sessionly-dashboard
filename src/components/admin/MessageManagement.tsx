import { useState } from 'react';
import { FiMail, FiUsers, FiCheckCircle, FiClock } from 'react-icons/fi';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  lastUsed?: string;
}

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  targetGroup: string;
  recipientCount: number;
  status: 'draft' | 'scheduled' | 'sent';
  scheduledDate?: string;
  sentDate?: string;
  openRate?: number;
}

const mockTemplates: EmailTemplate[] = [
  {
    id: 'template1',
    name: 'Welcome Email',
    subject: 'Welcome to Sessionly!',
    content: 'Dear {name},\n\nWelcome to Sessionly! We\'re excited to have you join our platform...',
    lastUsed: '2025-05-01'
  },
  {
    id: 'template2',
    name: 'Session Reminder',
    subject: 'Your upcoming session reminder',
    content: 'Dear {name},\n\nThis is a reminder about your upcoming session...',
    lastUsed: '2025-05-08'
  }
];

const mockCampaigns: EmailCampaign[] = [
  {
    id: 'campaign1',
    name: 'May Newsletter',
    subject: 'Latest Updates from Sessionly',
    content: 'Dear valued members...',
    targetGroup: 'All Users',
    recipientCount: 2500,
    status: 'sent',
    sentDate: '2025-05-01',
    openRate: 68
  },
  {
    id: 'campaign2',
    name: 'Expert Onboarding Follow-up',
    subject: 'Complete Your Expert Profile',
    content: 'Dear {expert_name}...',
    targetGroup: 'New Experts',
    recipientCount: 45,
    status: 'scheduled',
    scheduledDate: '2025-05-15'
  }
];

export function MessageManagement() {
  const [activeTab, setActiveTab] = useState<'compose' | 'templates' | 'campaigns'>('compose');
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(mockCampaigns);
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [targetGroup, setTargetGroup] = useState('all');
  const [recipientCount, setRecipientCount] = useState(0);

  const handleSendEmail = () => {
    // Implementation for sending email
    console.log('Sending email:', { subject, content, targetGroup });
  };

  const handleSaveTemplate = () => {
    const newTemplate: EmailTemplate = {
      id: `template${Date.now()}`,
      name: subject,
      subject,
      content,
      lastUsed: new Date().toISOString().split('T')[0]
    };
    setTemplates([...templates, newTemplate]);
  };

  const handleCreateCampaign = () => {
    const newCampaign: EmailCampaign = {
      id: `campaign${Date.now()}`,
      name: subject,
      subject,
      content,
      targetGroup,
      recipientCount,
      status: 'draft'
    };
    setCampaigns([...campaigns, newCampaign]);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Message Management</h1>
        <p className="text-gray-600 mt-2">Send targeted emails and manage campaigns</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sent (30d)</p>
              <h3 className="text-2xl font-semibold text-gray-900">12,450</h3>
            </div>
            <div className="p-3 bg-navy/5 rounded-lg">
              <FiMail className="w-6 h-6 text-navy" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg. Open Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900">68%</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <FiCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Campaigns</p>
              <h3 className="text-2xl font-semibold text-gray-900">3</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiClock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Recipients</p>
              <h3 className="text-2xl font-semibold text-gray-900">2.5k</h3>
            </div>
            <div className="p-3 bg-navy/5 rounded-lg">
              <FiUsers className="w-6 h-6 text-navy" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex gap-8 px-6">
            <button
              onClick={() => setActiveTab('compose')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'compose'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Compose
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'templates'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`py-4 text-sm font-medium border-b-2 ${
                activeTab === 'campaigns'
                  ? 'border-navy text-navy'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Campaigns
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'compose' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => {
                    setSelectedTemplate(e.target.value);
                    const template = templates.find(t => t.id === e.target.value);
                    if (template) {
                      setSubject(template.subject);
                      setContent(template.content);
                    }
                  }}
                  className="w-full rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                >
                  <option value="">Select a template</option>
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Recipients
                </label>
                <select
                  value={targetGroup}
                  onChange={(e) => {
                    setTargetGroup(e.target.value);
                    // Set mock recipient count based on selection
                    setRecipientCount(e.target.value === 'all' ? 2500 : 500);
                  }}
                  className="w-full rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                >
                  <option value="all">All Users</option>
                  <option value="students">All Students</option>
                  <option value="experts">All Experts</option>
                  <option value="inactive">Inactive Users</option>
                  <option value="new">New Users (Last 30 days)</option>
                </select>
                {recipientCount > 0 && (
                  <p className="mt-2 text-sm text-gray-600">
                    This will be sent to approximately {recipientCount} recipients
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                  className="w-full rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={10}
                  placeholder="Enter email content"
                  className="w-full rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={handleSaveTemplate}
                  className="px-4 py-2 text-sm font-medium text-navy hover:text-navy/80"
                >
                  Save as Template
                </button>
                <div className="space-x-4">
                  <button
                    onClick={handleCreateCampaign}
                    className="px-4 py-2 text-sm font-medium text-navy hover:text-navy/80"
                  >
                    Save as Campaign
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
                  >
                    Send Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-navy transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <button
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setSubject(template.subject);
                        setContent(template.content);
                        setActiveTab('compose');
                      }}
                      className="text-sm text-navy hover:text-navy/80"
                    >
                      Use Template
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Subject: {template.subject}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last used: {template.lastUsed}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              {campaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-navy transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      campaign.status === 'sent'
                        ? 'bg-green-100 text-green-800'
                        : campaign.status === 'scheduled'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Target Group: {campaign.targetGroup}</p>
                      <p className="text-gray-600">Recipients: {campaign.recipientCount}</p>
                    </div>
                    <div>
                      {campaign.status === 'sent' ? (
                        <>
                          <p className="text-gray-600">Sent: {campaign.sentDate}</p>
                          <p className="text-gray-600">Open Rate: {campaign.openRate}%</p>
                        </>
                      ) : campaign.status === 'scheduled' ? (
                        <p className="text-gray-600">Scheduled: {campaign.scheduledDate}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}