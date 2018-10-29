export default function ({ borders, colors, typography, spacing }) {
  return {
    headerBorderBottom: `${borders.style} ${colors.licorice}`,
    headerBackgroundColor: colors.porcelain,
    listFontSize: typography.fontSizeMedium,
    hamburgerIconPaddingTopBottom: spacing.small,
    hamburgerIconPaddingLeftRight: spacing.medium
  }
}
