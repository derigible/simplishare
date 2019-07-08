// @flow

import * as React from 'react'

import { Modal } from '@instructure/ui-overlays'
import { CloseButton } from '@instructure/ui-buttons'
import { TextInput } from '@instructure/ui-text-input'
import { Heading } from '@instructure/ui-elements'
import { Button } from '@instructure/ui-buttons'

export default function StandardEditModal (
  {closeModal, modalOpen, onSave, children, modalTitle} :
  {closeModal: any, modalOpen: boolean, onSave: any, children: React.Node, modalTitle: string}
) {
  const closeButton = () => (
    <CloseButton
      placement="end"
      offset="medium"
      variant="icon"
      onClick={closeModal}
    >
      Close
    </CloseButton>
  )
  return (
    <Modal
      open={modalOpen}
      onDismiss={closeModal}
      size="auto"
      label={modalTitle}
      shouldCloseOnDocumentClick
    >
      <Modal.Header>
        {closeButton()}
        <Heading>{modalTitle}</Heading>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={closeModal}>Close</Button>&nbsp;
        <Button variant="primary" type="submit" onClick={onSave}>Submit</Button>
      </Modal.Footer>
    </Modal>
  )
}
