import { connect } from 'react-redux'

import {
  fetchList,
  create
} from '../../../api.js'

import Contacts from './presenter'

function mapStateToProps (state) {
  const { contactsRetrieved, entities } = state.contact
  return { contactsRetrieved, contacts: Object.values(entities) }
}

function mapDispatchToProps (dispatch, props) {
  return {
    populateContacts: fetchList('Contacts')(dispatch),
    inviteContact: create('Contact')(dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts)
