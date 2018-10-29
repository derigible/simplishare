export default function ({ colors, spacing, borders }) {
  return {
    mainMargin: `${spacing.large} ${spacing.xSmall} ${spacing.xSmall} ${spacing.xSmall}`,
    mainBorderBottom: `${borders.radiusSmall} ${borders.style} ${colors.porcelain}`
  }
}
