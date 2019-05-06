import PropTypes from 'prop-types'
import React, { Component } from 'react'

import Alert from '@instructure/ui-alerts/lib/Alert'
import Button from '@instructure/ui-buttons/lib/Button'
import Heading from '@instructure/ui-elements/lib/Heading'
import CloseButton from '@instructure/ui-buttons/lib/CloseButton'
import View from '@instructure/ui-layout/lib/View'
import Modal, {ModalBody, ModalFooter, ModalHeader} from '@instructure/ui-overlays/lib/Modal'
import TextInput from '@instructure/ui-forms/lib/TextInput'

import Contact from './Contact'
import ListItem from '../../../common/components/ListItem'
import Chrome from '../../../common/components/Chrome'

export default class Contacts extends Component {
  static propTypes = {
    contacts: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      email: PropTypes.string.isRequired,
      contact_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      created_at: PropTypes.string.isRequired
    })).isRequired,
    inviteContact: PropTypes.func.isRequired,
    contactsRetrieved: PropTypes.oneOf(['success', 'inProgress', 'pending', 'error']),
    populateContacts: PropTypes.func.isRequired
  }

  state = {
    open: false,
    size: 'auto',
    alertMessage: '',
    alertType: 'info'
  }

  get contacts () {
    return this.props.contacts.filter((contact) => contact.contact_id !== 'pending')
  }

  get pendingContacts () {
    return this.props.contacts.filter((contact) => contact.contact_id === 'pending')
  }

  performRetrieval = () => {
    const promises = []
    if (this.props.contactsRetrieved === 'pending') {
      promises.push(this.props.populateContacts())
    }
    Promise.all(promises)
  }

  componentDidMount () {
    this.performRetrieval()
  }

  handleModalOpen = () => {
    this.setState(function (state) {
      return { open: !state.open }
    })
  }

  handleCreateContact = () => {
    this.props.inviteContact({email: this.textInputRef.value})
      .then(() => {
        this.handleModalOpen()
        this.setAlertMessage('Contact Invitation Sent', 'success')
      })
      .catch(() => {
        this.handleModalOpen()
        this.setAlertMessage('Error in creating contact', 'error')
      })
  }

  setAlertMessage = (alertMessage, alertType = 'info') => {
    this.setState({alertMessage, alertType})
    setTimeout(() => this.setState({alertMessage: ''}), 3500)
  }

  setTextInputRef = (node) => { this.textInputRef = node }

  renderCloseButton () {
    return (
      <CloseButton
        placement="end"
        offset="medium"
        variant="icon"
        onClick={this.handleModalOpen}
      >
        Close
      </CloseButton>
    )
  }

  render () {
    const pendingContacts = this.pendingContacts
    const contacts = this.contacts
    return (
      <Chrome>
        <Heading margin="small none" border="bottom">Contacts</Heading>
        <View as="div">
          {
            this.state.alertMessage.length > 0
            ? <Alert
                variant={this.state.alertType}
                closeButtonLabel="Close"
                margin="small"
                transition="none"
              >
                {this.state.alertMessage}
              </Alert>
            : null
          }
          <Button
            variant="light"
            onClick={this.handleModalOpen}
          >
            Add Contact
          </Button>
          <Modal
            open={this.state.open}
            onDismiss={() => { this.setState({ open: false }) }}
            size="medium"
            label="Create Contact"
            shouldCloseOnDocumentClick
          >
            <ModalHeader>
              {this.renderCloseButton()}
              <Heading>Create Contact</Heading>
            </ModalHeader>
            <ModalBody>
              <TextInput
                label="Email of Contact"
                type="email"
                required
                inputRef={this.setTextInputRef}
              />
            </ModalBody>
            <ModalFooter>
              <Button onClick={this.handleModalOpen}>Cancel</Button>&nbsp;
              <Button onClick={this.handleCreateContact} variant="primary">Connect</Button>
            </ModalFooter>
          </Modal>
          {pendingContacts.length > 0 || contacts.length === 0
            ? <Heading level="h3" margin="small 0">Current</Heading>
            : null
          }
          {contacts.length > 0
            ? contacts.map((contact) => {
                return <ListItem
                  key={contact.id}
                  renderChildren={
                    () => {
                      return (
                        <Contact contact={contact}/>
                      )
                    }
                  }
                />
              })
            : <View as="div">No current contacts</View>
          }
          {pendingContacts.length > 0
            ? <Heading level="h3" margin="small 0">Pending</Heading>
            : null
          }
          {
            pendingContacts.map((contact) => {
              return <ListItem
                key={contact.id}
                renderChildren={
                  () => {
                    return (
                      <Contact contact={contact}/>
                    )
                  }
                }
              />
            })
          }
        </View>
      </Chrome>
    )
  }
}
