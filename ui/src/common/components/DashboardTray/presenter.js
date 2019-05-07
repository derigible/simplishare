import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import ActiveStorageProvider from 'react-activestorage-provider'

import {Billboard} from '@instructure/ui-billboard'
import {FileDrop} from '@instructure/ui-forms'
import {Heading} from '@instructure/ui-elements'

import {IconPlusSolid} from '@instructure/ui-icons'
import {themeable} from '@instructure/ui-themeable'

import styles from './styles.css'
import theme from './theme'

class DashboardTray extends PureComponent {
  render () {
    const { acceptFile, endpointConfig, rejectFile, successfulSubmit } = this.props
    return (
      <ActiveStorageProvider
        endpoint={endpointConfig}
        onSubmit={successfulSubmit}
        render={({ handleUpload, uploads, ready }) => (
          <div className={styles.main}>
            <Heading
              level="h4"
              color="secondary"
              as="h1"
            >
              Add Transactions
            </Heading>
            <FileDrop
              accept=".csv"
              // eslint-disable-next-line no-console
              onDrop={(_1, _2, e, list, list2) => { console.log(_1, e.target, list, list2); handleUpload(list2)}}
              onDropAccepted={acceptFile}
              onDropRejected={rejectFile}
              label={
                <Billboard
                  size="small"
                  message="Drag and Drop, or Click to Browse."
                  hero={<IconPlusSolid />}
                />
              }
            />
          </div>
        )}
      />
    )
  }

}

DashboardTray.propTypes = {
  endpointConfig: PropTypes.shape({
    path: PropTypes.string.isRequired,
    model: PropTypes.string.isRequired,
    attribute: PropTypes.string.isRequired,
    method: PropTypes.oneOf(['PUT', 'POST'])
  }),
  acceptFile: PropTypes.func,
  successfulSubmit: PropTypes.func,
  rejectFile: PropTypes.func
}

export default themeable(theme, styles)(DashboardTray)
