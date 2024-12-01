import React, { useState, useEffect, useCallback } from 'react';
import { AlertCircle, CheckCircle, Copy, Edit2, Send, Eye, Save } from 'lucide-react';

interface ProfileData {
  linkedInUrl: string;
  mainContent: string;
  contactInfo?: string;
}

interface StatusMessage {
  message: string;
  type: 'success' | 'error';
  id: string;
}

const ProfileSaver: React.FC = () => {
  const [profileData, setProfileData] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentTab, setCurrentTab] = useState<chrome.tabs.Tab | null>(null);
  const [statusMessages, setStatusMessages] = useState<StatusMessage[]>([]);

  useEffect(() => {
    // Initialize current tab
    const getCurrentTab = async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      setCurrentTab(tab);
    };

    getCurrentTab();

    // Listen for tab changes
    const tabChangeListener = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
      if (changeInfo.status === 'complete') {
        getCurrentTab();
      }
    };

    chrome.tabs.onActivated.addListener(getCurrentTab);
    chrome.tabs.onUpdated.addListener(tabChangeListener);

    return () => {
      chrome.tabs.onActivated.removeListener(getCurrentTab);
      chrome.tabs.onUpdated.removeListener(tabChangeListener);
    };
  }, []);

  const showStatus = useCallback((message: string, type: 'success' | 'error', id: string) => {
    setStatusMessages(prev => [...prev, { message, type, id }]);
    setTimeout(() => {
      setStatusMessages(prev => prev.filter(msg => msg.id !== id));
    }, 3000);
  }, []);

  const handleScrapeProfile = async () => {
    if (!currentTab?.id) {
      showStatus('Error: Could not find active tab', 'error', 'scrape');
      return;
    }

    if (!currentTab.url?.includes('linkedin.com')) {
      showStatus('Error: Please navigate to a LinkedIn profile page', 'error', 'scrape');
      return;
    }

    try {
      const response = await chrome.tabs.sendMessage(currentTab.id, { action: "pullInfo" });
      if (response?.status === "success") {
        showStatus('Profile scraped successfully!', 'success', 'scrape');
      } else {
        showStatus(`Error scraping profile: ${response?.message || 'Unknown error'}`, 'error', 'scrape');
      }
    } catch (error) {
      showStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 'scrape');
    }
  };

  const handleEdit = () => {
    setIsEditing(!isEditing);
    showStatus(
      isEditing ? 'Changes saved!' : 'Editing mode. Click Save when done.',
      'success',
      'edit'
    );
  };

  const handleCopy = async () => {
    if (!profileData) {
      showStatus('No data to copy', 'error', 'copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(profileData);
      showStatus('Copied to clipboard!', 'success', 'copy');
    } catch (error) {
      showStatus('Failed to copy', 'error', 'copy');
    }
  };

  const handleSendToCRM = async () => {
    if (!profileData) {
      showStatus('No data to send', 'error', 'crm');
      return;
    }

    try {
      const { webhookUrl } = await chrome.storage.sync.get('webhookUrl');
      if (!webhookUrl) {
        showStatus('Please set the webhook URL in extension options', 'error', 'crm');
        return;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileData }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      showStatus('Sent to CRM successfully!', 'success', 'crm');
    } catch (error) {
      showStatus(`Failed to send to CRM: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 'crm');
    }
  };

  const handleViewPosts = async () => {
    if (!currentTab?.url?.includes('linkedin.com')) {
      showStatus('Error: Please navigate to a LinkedIn profile first', 'error', 'posts');
      return;
    }

    try {
      const baseUrl = currentTab.url.split('?')[0];
      const postsUrl = `${baseUrl}recent-activity/all/`;
      await chrome.tabs.create({ url: postsUrl });
    } catch (error) {
      showStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error', 'posts');
    }
  };

  useEffect(() => {
    const messageListener = (
      message: any,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: any) => void
    ) => {
      if (message.type === 'profileData') {
        setProfileData(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold">LinkedIn Profile Saver</h2>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleScrapeProfile}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Profile
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? 'Save' : 'Edit'}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy
          </button>

          <button
            onClick={handleSendToCRM}
            className="flex items-center px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            <Send className="w-4 h-4 mr-2" />
            Send to CRM
          </button>

          <button
            onClick={handleViewPosts}
            className="flex items-center px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Posts
          </button>
        </div>

        <div className="space-y-2">
          {statusMessages.map((status) => (
            <div
              key={status.id}
              className={`flex items-center p-3 rounded ${
                status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {status.message}
            </div>
          ))}
        </div>

        <textarea
          value={profileData}
          onChange={(e) => setProfileData(e.target.value)}
          readOnly={!isEditing}
          className="w-full h-64 p-3 border rounded resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Profile data will appear here..."
        />
      </div>
    </div>
  );
};

export default ProfileSaver;