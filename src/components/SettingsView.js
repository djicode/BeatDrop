import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { setInstallationDirectory, setAutoLoadMore, setOfflineMode, setTheme, setFolderStructure, setUpdateChannel, setLatestReleaseNotes } from '../actions/settingsActions'
import { checkDownloadedSongs } from '../actions/queueActions'
import '../css/SettingsView.scss'
import Button from './Button'
import Toggle from './Toggle';

const { ipcRenderer } = window.require('electron')

class SettingsView extends Component {

  constructor(props) {
    super(props)

    this.state = {
      updateStatus: ''
    }
  }

  componentDidMount() {
    ipcRenderer.on('electron-updater', (_, event, message) => {
      if(event === 'checking-for-update' || event === 'update-not-available' || event === 'update-available' || event === 'error') {
        this.setState({ updateStatus: event })
      }
    })
  }

  updateValue() {
    switch(this.state.updateStatus) {
      case 'checking-for-update':
        return 'Checking...'
      case 'update-not-available':
        return 'Up to Date!'
      case 'update-available':
        return 'Update Available!'
      case 'error':
        return 'Update Error!'
      default:
        return 'Check for Updates'
    }
  }

  render() {
    return (
      <div id='settings-view'>
        <h1>Settings</h1>
        <h2>Beat Saber Installation Directory</h2>
        <span id="installation-directory-display"><input className="text-box" type="text" id="dl-loc-box" value={ this.props.settings.installationDirectory } disabled /></span>
        <input type="file" id="dl-location" webkitdirectory="" onChange={ (e) => {this.props.setInstallationDirectory(e.target.files[0].path || this.props.settings.installationDirectory)} } /><br />
        <label htmlFor="dl-location"><Button type="primary">Choose Folder</Button></label><Button onClick={ () => {window.require('child_process').exec('start "" "' + this.props.settings.installationDirectory + '"')} }>Open Folder</Button><br /><br />
        <hr />
        <h2>Song List</h2>
        <Toggle toggled={ this.props.settings.autoLoadMore } onToggle={ () => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore) } /><label htmlFor="auto-load-more">Auto Load More</label><br /><br />
        <Toggle toggled={ this.props.settings.offlineMode } onToggle={ () => this.props.setOfflineMode(!this.props.settings.offlineMode) } /><label htmlFor="offline-mode">Offline Mode</label><br />
        <hr />
        <h2>Downloads</h2>
        <Button onClick={ this.props.checkDownloadedSongs }>Scan for Songs</Button><br /><br />
        <label htmlFor="folder-structure-select">Folder Structure</label><br /><br />
        <select id="folder-structure-select" name="folder-structure-select" value={ this.props.settings.folderStructure } onChange={ (e) => { this.props.setFolderStructure(e.target.value) } }>
          <option value="idKey">ID/Key</option>
          <option value="songName">Song Name</option>
        </select>
        <hr />
        <h2>Theme</h2>
        <select id="theme-select" name="theme-select" value={ this.props.settings.theme } onChange={ (e) => { this.props.setTheme(e.target.value) } }>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="hc">High Contrast</option>
        </select>
        <hr />
        <h2>Updates</h2>
        <b>Current Version: </b>{ require('../../package.json').version }<br /><br />
        <Button onClick={ () => { this.props.setLatestReleaseNotes('0.0.0') } }>View Release Notes</Button><br /><br />
        <label htmlFor="update-channel-select">Update Channel</label><br /><br />
        <select id="update-channel-select" name="update-channel-select" value={ this.props.settings.updateChannel } onChange={ (e) => { this.props.setUpdateChannel(e.target.value) } }>
          <option value="latest">Stable</option>
          <option value="beta">Beta</option>
        </select><br /><br />
        {this.props.settings.updateChannel === 'beta' ? <><span style={ { fontWeight: 'bold', color: 'salmon' } }>Warning: Beta builds are unstable, untested and may result in unexpected crashes, loss of files and other adverse effects! By updating to a beta build, you understand and accept these risks.</span><br /><br /></> : null}
        <Button type={ this.state.updateStatus === 'error' ? 'destructive' : null } onClick={ () => { ipcRenderer.send('electron-updater', 'check-for-updates') } }>{this.updateValue()}</Button>
        <br /><br />
        <hr />
        <h2>Credits</h2>
        <b>Developer</b><br />
        StarGazer1258<br /><br />
        <b>Icon and Animation Designer, BeastSaber Developer</b><br />
        Elliotttate<br /><br />
        <b>Additional Icons Provided by</b><br />
        <a href="https://icons8.com/" onClick={ (e) => { e.preventDefault(); e.stopPropagation(); window.require('electron').shell.openExternal(e.target.href) } }>Icons8</a><br /><br />
        <br /><br />
      </div>
    )
  }
}

SettingsView.propTypes = {
  settings: PropTypes.object.isRequired,
  setInstallationDirectory: PropTypes.func.isRequired,
  setAutoLoadMore: PropTypes.func.isRequired,
  setTheme: PropTypes.func.isRequired,
  setFolderStructure: PropTypes.func.isRequired,
  setUpdateChannel: PropTypes.func.isRequired,
  checkDownloadedSongs: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  settings: state.settings
})

export default connect(mapStateToProps, { setInstallationDirectory, setAutoLoadMore, setOfflineMode, setTheme, setFolderStructure, setUpdateChannel, setLatestReleaseNotes, checkDownloadedSongs })(SettingsView)

//<input type="checkbox" name="auto-refresh" id="auto-refresh" checked={this.props.settings.autoRefresh} onClick={() => this.props.setAutoLoadMore(!this.props.settings.autoLoadMore)} /><label htmlFor="auto-refresh">Refresh feed every </label><input type="number" name="auto-refresh-interval" id="auto-refresh-interval"/><label htmlFor="auto-refresh-interval"> seconds</label>