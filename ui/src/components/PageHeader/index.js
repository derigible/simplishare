// @flow

import React from 'react'

import { Heading } from '@instructure/ui-elements'
import { Breadcrumb } from '@instructure/ui-breadcrumb'
import { View } from '@instructure/ui-layout'

import type { BreadCrumbType } from './type'

export default function PageHeader(
  {pageName, breadCrumbs} : {pageName?: string, breadCrumbs?: Array<BreadCrumbType>, size?: string}
) {
  if (pageName) {
    return (
      <Heading level="h1" border="bottom">
        {pageName}
      </Heading>
    )
  } else if (breadCrumbs && breadCrumbs.length > 0) {
    return (
      <View as="div" padding="medium none" borderWidth="none none small none">
        <Breadcrumb size="large" label="Application Navigation">
          {
            breadCrumbs.map(b => (
              <Breadcrumb.Link key={b.href} href={b.href} icon={b.icon}>
                {b.linkText}
              </Breadcrumb.Link>
            ))
          }
        </Breadcrumb>
      </View>
    )
  } else {
    return null
  }
}
