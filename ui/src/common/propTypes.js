import PropTypes from 'prop-types'

export const id = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

export const possibleTags =  PropTypes.arrayOf(
  PropTypes.shape({
    label: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired
    }))
  })
).isRequired

export const selectionManagerProps = {
  possibleTags,
  onSelectTag: PropTypes.func.isRequired,
  onTagDefine: PropTypes.func.isRequired,
  onMenuOpenChange: PropTypes.func,
  label: PropTypes.string,
  selectedTags: PropTypes.arrayOf(id)
}

export const todoProps = PropTypes.shape({
  id: PropTypes.string.isRequired,
  description: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.number),
  todos: PropTypes.array,
  archived: PropTypes.bool,
  priority: PropTypes.oneOf(['low', 'medium', 'high']).isRequired,
  title: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  updated_at: PropTypes.string.isRequired,
  metadata: PropTypes.shape({
    permissions: PropTypes.arrayOf(PropTypes.string)
  }),
  sharedOn: PropTypes.string,
  shared: PropTypes.bool
})

export const todoParentChainProps = PropTypes.arrayOf(id)

export const deletedTodosProps = PropTypes.instanceOf(Set)

export const fetchRetrievalStatusProps = PropTypes.oneOf(['success', 'inProgress', 'pending', 'error'])
