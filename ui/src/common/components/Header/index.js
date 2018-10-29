import Header from './presenter'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from '../../../actions'

function mapStateToProps (state) {
  const isOpen = state.sidebar.isOpen
  const login = state.login
  const { username } = state.auth.user
  const windowPathname = window.location.pathname
  return { login, isOpen, username, windowPathname }
}

function mapDispatchToProps (dispatch) {
  return {
    closeSidebar: bindActionCreators(actions.closeSidebar, dispatch),
    openSidebar: bindActionCreators(actions.openSidebar, dispatch),
    logout: () => {
      window.localStorage.clear()
      dispatch(actions.logout())
      dispatch(actions.navigateTo('/auth'))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
