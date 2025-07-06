import PropTypes from 'prop-types'
import { FiGlobe, FiMail, FiSettings, FiUser, FiUserCheck } from 'react-icons/fi'
import GeneralTab from './GeneralTab'
import EmailTab from './EmailTab'
import ExternalServicesTab from './ExternalServicesTab'
import UserTab from './UserTab'
import ProfileTab from './ProfileTab'

const SettingsTabs = ({ activeTab, onTabChange, tabContentProps }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <GeneralTab
            settings={tabContentProps.settings}
            onSettingsChange={tabContentProps.onGeneralSettingsChange}
          />
        )

      case 'profile':
        return (
          <ProfileTab
            profiles={tabContentProps.settings.profiles}
            activeProfileId={tabContentProps.activeProfileId}
            selectedProfileId={tabContentProps.selectedProfileId}
            onProfileChange={tabContentProps.onProfileChange}
            onSettingsChange={tabContentProps.onSettingsChange}
            onSelectProfile={tabContentProps.onSelectProfile}
          />
        )

      case 'user':
        return (
          <UserTab
            userData={tabContentProps.settings}
            onSettingsChange={tabContentProps.onSettingsChange}
          />
        )

      case 'email':
        return (
          <EmailTab
            settings={tabContentProps.settings}
            onSettingsChange={tabContentProps.onSettingsChange}
          />
        )

      case 'external':
        return (
          <ExternalServicesTab
            settings={tabContentProps.settings}
            onSettingsChange={tabContentProps.onSettingsChange}
          />
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="settings-tabs-container">
        <div className="settings-tabs">
          <button
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => onTabChange('general')}
            aria-selected={activeTab === 'general'}
            aria-controls="general-tabpanel"
            id="general-tab"
            role="tab"
          >
            <FiSettings className="tab-icon" />
            <span>General</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => onTabChange('profile')}
            aria-selected={activeTab === 'profile'}
            aria-controls="profile-tabpanel"
            id="profile-tab"
            role="tab"
          >
            <FiUser className="tab-icon" />
            <span>Perfiles</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => onTabChange('user')}
            aria-selected={activeTab === 'user'}
            aria-controls="user-tabpanel"
            id="user-tab"
            role="tab"
          >
            <FiUserCheck className="tab-icon" />
            <span>Usuario</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'email' ? 'active' : ''}`}
            onClick={() => onTabChange('email')}
            aria-selected={activeTab === 'email'}
            aria-controls="email-tabpanel"
            id="email-tab"
            role="tab"
          >
            <FiMail className="tab-icon" />
            <span>Correo</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'external' ? 'active' : ''}`}
            onClick={() => onTabChange('external')}
            aria-selected={activeTab === 'external'}
            aria-controls="external-tabpanel"
            id="external-tab"
            role="tab"
          >
            <FiGlobe className="tab-icon" />
            <span>Servicios</span>
          </button>
        </div>
      </div>

      <div className="settings-content">{renderTabContent()}</div>
    </>
  )
}

SettingsTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  tabContentProps: PropTypes.shape({
    settings: PropTypes.object.isRequired,
    activeProfileId: PropTypes.string,
    selectedProfileId: PropTypes.string,
    onProfileChange: PropTypes.func,
    onSettingsChange: PropTypes.func.isRequired,
    onSelectProfile: PropTypes.func,
    onGeneralSettingsChange: PropTypes.func
  }).isRequired
}

export default SettingsTabs
