import React, { Component } from 'react'
import PropTypes from 'prop-types'
import difference from 'lodash/difference'

import {Button} from '@instructure/ui-buttons'
import {Text} from '@instructure/ui-elements'
import {Heading} from '@instructure/ui-elements'
import {Flex} from '@instructure/ui-layout'
import {Pill} from '@instructure/ui-elements'
import {TextInput, TextArea} from '@instructure/ui-forms'
import {View} from '@instructure/ui-layout'

import { NOTES_SET_NOTES } from '../../../constants/actionTypes'

import SelectionManager from '../../../common/components/SelectionManager'
import Share from '../../../common/components/Share'
import * as customPropTypes from '../../../common/propTypes'
import Priority from '../../../common/components/Priority'

export default class Note extends Component {
  static propTypes = {
    entity: PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      title: PropTypes.string,
      body: PropTypes.string,
      tags: PropTypes.arrayOf(PropTypes.number),
      needToLoad: PropTypes.bool,
      priority: PropTypes.string
    }),
    possibleTags: customPropTypes.possibleTags,
    populateNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    createNote: PropTypes.func.isRequired,
    endNoteEdit: PropTypes.func.isRequired,
    tagEntity: PropTypes.func.isRequired,
    removeTag: PropTypes.func.isRequired,
    createTag: PropTypes.func.isRequired,
    isEdit: PropTypes.bool,
    switchNoteView: PropTypes.func.isRequired,
    selectedTags: PropTypes.arrayOf(customPropTypes.id)
  }

  static defaultProps = {
    entity: null,
    isEdit: false
  }

  constructor (props) {
    super(props)
    this.state = {
      body: props.entity.body || '',
      title: props.entity.title || 'Untitled Note',
      tag_ids: props.entity.tags || props.selectedTags,
      errors: {},
      priority: props.entity.priority
    }
  }

  componentDidMount () {
    if (this.props.entity.title) {
      this.titleRef && this.titleRef.focus()
    } else {
      this.titleRef && this.titleRef.select()
    }
    if (this.isNewNote && !this.props.isEdit) {
      this.switchToEdit()
    } else if (this.loaded) {
      this.props.populateNote()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.entity.body && this.state.body === '') {
      this.setState({body: nextProps.entity.body, title: nextProps.entity.title, tag_ids: nextProps.entity.tags})
    }
  }

  get isNewNote () {
    return this.props.entity.id === 'newNote'
  }

  get loaded () {
    return this.props.entity.needToLoad && !this.isNewNote
  }

  switchToEdit = () => {
    this.props.switchNoteView('edit')
  }

  switchToRead = () => {
    this.props.switchNoteView('read')
  }

  persistNoteData (data) {
    if (this.props.entity.id !== 'newNote') {
      return this.props.updateNote(this.props.entity.id, data)
    } else {
      return this.props.createNote(data)
    }
  }

  saveNote = () => {
    const data = {
      title: this.state.title,
      body: this.state.body,
      priority: this.state.priority
    }
    if (data.body.length === 0) {
      this.setState({
        errors: {
          body: [{
            text: 'Body must not be empty.',
            type: 'error'
          }]
        }
      })
    } else {
      this.persistNoteData(data)
        .then((noteData) => {
          if (difference(this.state.tag_ids, this.props.entity.tags).length > 0){
            this.props.tagEntity(
              {type: NOTES_SET_NOTES, payload: [{ id: noteData.payload[0].id }] },
              this.state.tag_ids
            )
          } else if(difference(this.props.entity.tags, this.state.tag_ids).length > 0) {
            this.props.removeTag(
              {type: NOTES_SET_NOTES, payload: [{ id: this.props.entity.id }] },
              difference(this.props.entity.tags, this.state.tag_ids)
            )
          }
        })
        .then(() => { this.props.endNoteEdit() })
    }
  }

  handleTagging = (tag_ids) => {
    this.setState({ tag_ids })
  }

  handleTagDefine = (name) => {
    this.props.createTag({ name })
      .then((tagData) => {
        this.setState({ tag_ids: this.state.tag_ids.concat([tagData.payload[0].id])})
      })
  }

  handleBodyChange = (e) => {
    const changes = {body: e.target.value}
    if (this.state.errors.body) {
      changes.errors = { ...this.state.errors, ...{ body: null } }
    }
    this.setState(changes)
  }

  handleTitleChange = (e) => {
    this.setState({title: e.target.value})
  }

  changePriority = (priority) => {
    this.setState({ priority })
  }

  setTitleRef = (node) => { this.titleRef = node }

  computeRemFromPx (px) {
    return Math.floor(px / parseFloat(getComputedStyle(document.documentElement).fontSize))
  }

  getRemHeight () {
    const availHeight = document.documentElement.clientHeight
    const portionOFHeight = availHeight * .40
    return `${this.computeRemFromPx(availHeight - portionOFHeight)}rem`
  }

  render () {
    const { possibleTags, isEdit, entity } = this.props
    return (
      <View as="div" margin="none small">
        <Flex direction="column">
          <Flex.Item padding="x-small xx-small">
            {isEdit
              ? <TextInput
                  label="Note Title"
                  value={this.state.title}
                  onChange={this.handleTitleChange}
                  inputRef={this.setTitleRef}
                />
              : <Heading level="h2">{this.state.title}</Heading>
            }
          </Flex.Item>
          <Flex.Item grow shrink padding="xxx-small xx-small">
            {isEdit
              ? <TextArea
                  height={this.getRemHeight()}
                  autoGrow={false}
                  label="Main Body"
                  value={this.state.body}
                  resize="vertical"
                  onChange={this.handleBodyChange}
                  messages={this.state.errors.body || []}
                />
              : <p><Text as="pre">{this.state.body}</Text></p>
            }
            {/* Use Details here */}
            {/* This is moved into the same Flex.Item for now due to instui bug */}
            {isEdit
              ? <View as="div" margin="x-small xx-small">
                  <SelectionManager
                    possibleTags={possibleTags}
                    onSelectTag={this.handleTagging}
                    onTagDefine={this.handleTagDefine}
                    selectedTags={this.state.tag_ids}
                    label="Tags"
                  />
                </View>
              : this.state.tag_ids.map((t) => {
                  const tag = possibleTags[0].options.find((pt) => pt.id === t)
                  if (tag) {
                    return <Pill key={tag.id} text={tag.name} margin="0 small 0 0" />
                  }
                })
            }
          </Flex.Item>
          <Flex.Item margin="small 0 small 0">
            <Heading as={isEdit ? 'h3' : 'h2'} level="h4" border="bottom">Manage Attributes</Heading>
          </Flex.Item>
          <Flex.Item>
            <Flex>
              {!this.isNewNote
                ? (
                    <Flex.Item grow shrink>
                      <Share
                        shareId={entity.id}
                        shareType="Note"
                      />
                    </Flex.Item>
                  )
                : null
              }
            </Flex>
          </Flex.Item>
          <Flex.Item padding="small xx-small">
            <hr />
            <Button variant="primary" onClick={isEdit ? this.saveNote : this.switchToEdit}>
              {isEdit ? 'Save Note' : 'Edit Note'}
            </Button>
            <Button onClick={this.props.endNoteEdit} margin="none none none small">
              {isEdit ? 'Cancel' : 'Back'}
            </Button>
          </Flex.Item>
        </Flex>
      </View>
    )
  }
}
