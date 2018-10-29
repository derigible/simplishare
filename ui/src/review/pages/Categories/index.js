import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { setLookupTerm, setLookupParam } from '../../../actions'
import { fetchList } from '../../../api.js'
import Category from '../../../records/Category'

import Categories from './presenter'

function mapStateToProps (state) {
  const categories = Object.values(state.category.entities).map((c) => new Category(c, state))
  const { categoriesRetrieved, lookup_term, lookup_param } = state.dashboard
  return { categories, categoriesRetrieved, lookup_term, lookup_param }
}

function mapDispatchToProps (dispatch) {
  return {
    populateCategories: fetchList('Categories')(dispatch),
    populateCategoryEvents: fetchList('CategoryEvents')(dispatch),
    setLookupTerm: bindActionCreators(setLookupTerm, dispatch),
    setLookupParam: bindActionCreators(setLookupParam, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Categories)
