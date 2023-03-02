import { colors, spacers } from '@dhis2/ui'
import {
    FONT_STYLE_VISUALIZATION_TITLE,
    FONT_STYLE_VISUALIZATION_SUBTITLE,
    FONT_STYLE_OPTION_FONT_SIZE,
    FONT_STYLE_OPTION_TEXT_COLOR,
    FONT_STYLE_OPTION_TEXT_ALIGN,
    FONT_STYLE_OPTION_ITALIC,
    FONT_STYLE_OPTION_BOLD,
    TEXT_ALIGN_LEFT,
    TEXT_ALIGN_RIGHT,
    TEXT_ALIGN_CENTER,
    mergeFontStyleWithDefault,
    defaultFontStyle,
} from '../../../../modules/fontStyle.js'
import {
    getColorByValueFromLegendSet,
    LEGEND_DISPLAY_STYLE_FILL,
} from '../../../../modules/legends.js'

const svgNS = 'http://www.w3.org/2000/svg'

const generateValueSVG = ({
    formattedValue,
    subText,
    valueColor,
    icon,
    noData,
    containerWidth,
    containerHeight,
}) => {
    const ratio = containerHeight / containerWidth
    const iconSize = 300
    const textSize = iconSize * 0.85
    const textWidth = textSize * 0.75 * formattedValue.length

    let viewBoxWidth = textWidth

    if (icon) {
        viewBoxWidth += iconSize
    }

    const viewBoxHeight = viewBoxWidth * ratio

    const svgValue = document.createElementNS(svgNS, 'svg')
    svgValue.setAttribute('xmlns', svgNS)
    svgValue.setAttribute('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`)
    svgValue.setAttribute('width', containerWidth * 0.95)
    svgValue.setAttribute('height', containerHeight * 0.95)
    svgValue.setAttribute('x', '50%')
    svgValue.setAttribute('y', '50%')
    svgValue.setAttribute('style', 'overflow: visible')

    let fillColor = colors.grey900

    if (valueColor) {
        fillColor = valueColor
    } else if (formattedValue === noData.text) {
        fillColor = colors.grey600
    }

    // show icon if configured in maintenance app
    if (icon) {
        const imageNode = document.createElementNS(svgNS, 'image')
        imageNode.setAttribute('href', icon)
        imageNode.setAttribute('width', iconSize)
        imageNode.setAttribute('height', iconSize)
        imageNode.setAttribute('y', `-${iconSize / 2}`)
        imageNode.setAttribute('x', `-${textWidth / 2}`)

        svgValue.appendChild(imageNode)
    }

    const textNode = document.createElementNS(svgNS, 'text')
    textNode.setAttribute('font-size', textSize)
    textNode.setAttribute('font-weight', '300')
    textNode.setAttribute('letter-spacing', '-5')
    textNode.setAttribute('x', icon ? `-${textWidth / 2 - iconSize}` : 0)
    textNode.setAttribute('y', 0)
    textNode.setAttribute('fill', fillColor)
    textNode.setAttribute('alignment-baseline', 'central')
    textNode.setAttribute('data-test', 'visualization-primary-value')

    if (!icon) {
        textNode.setAttribute('text-anchor', 'middle')
    }

    textNode.appendChild(document.createTextNode(formattedValue))

    svgValue.appendChild(textNode)

    if (subText) {
        const subTextSize = 40

        const subTextNode = document.createElementNS(svgNS, 'text')
        subTextNode.setAttribute('text-anchor', 'middle')
        subTextNode.setAttribute('font-size', subTextSize)
        subTextNode.setAttribute('y', iconSize / 2)
        subTextNode.setAttribute('fill', colors.grey600)
        subTextNode.setAttribute('alignment-baseline', 'hanging')
        subTextNode.appendChild(document.createTextNode(subText))

        svgValue.appendChild(subTextNode)
    }

    return svgValue
}

/* commented out to keep the code for comparison with generateItem.
 * dashboard does not need all of the features as for DV app
 
const generateDashboardItem = (config, { valueColor, noData }) => {
    const container = document.createElement('div')
    container.setAttribute(
        'style',
        'display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%'
    )

    const titleStyle = 'font-size: 12px; color: #666;'

    const title = document.createElement('span')
    title.setAttribute('style', titleStyle)
    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        container.appendChild(title)
    }

    const subtitle = document.createElement('span')
    subtitle.setAttribute('style', titleStyle + ' margin-top: 4px')
    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        container.appendChild(subtitle)
    }

    container.appendChild(
        generateValueSVG({
            formattedValue: config.formattedValue,
            icon: config.icon,
            subText: config.subText,
            valueColor,
            noData,
            y: 40,
        })
    )

    return container
}
*/

const getTextAnchorFromTextAlign = (textAlign) => {
    switch (textAlign) {
        default:
        case TEXT_ALIGN_LEFT:
            return 'start'
        case TEXT_ALIGN_CENTER:
            return 'middle'
        case TEXT_ALIGN_RIGHT:
            return 'end'
    }
}

const getXFromTextAlign = (textAlign) => {
    switch (textAlign) {
        default:
        case TEXT_ALIGN_LEFT:
            return '1%'
        case TEXT_ALIGN_CENTER:
            return '50%'
        case TEXT_ALIGN_RIGHT:
            return '99%'
    }
}

const generateItem = (
    config,
    { valueColor, titleColor, parentEl, fontStyle, noData }
) => {
    const parentElBBox = parentEl.getBoundingClientRect()

    const width = parentElBBox.width
    const height = parentElBBox.height

    const svgNS = 'http://www.w3.org/2000/svg'

    const svg = document.createElementNS(svgNS, 'svg')
    svg.setAttribute('xmlns', svgNS)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.setAttribute('width', '100%')
    svg.setAttribute('height', '100%')
    svg.setAttribute('data-test', 'visualization-container')

    const svgWrapper = document.createElementNS(svgNS, 'svg')

    const title = document.createElementNS(svgNS, 'text')
    const titleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_TITLE],
        FONT_STYLE_VISUALIZATION_TITLE
    )
    title.setAttribute(
        'x',
        getXFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    title.setAttribute('y', 28)
    title.setAttribute(
        'text-anchor',
        getTextAnchorFromTextAlign(titleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    title.setAttribute(
        'font-size',
        `${titleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`
    )
    title.setAttribute(
        'font-weight',
        titleFontStyle[FONT_STYLE_OPTION_BOLD]
            ? FONT_STYLE_OPTION_BOLD
            : 'normal'
    )
    title.setAttribute(
        'font-style',
        titleFontStyle[FONT_STYLE_OPTION_ITALIC]
            ? FONT_STYLE_OPTION_ITALIC
            : 'normal'
    )
    if (
        titleColor &&
        titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
            defaultFontStyle[FONT_STYLE_VISUALIZATION_TITLE][
                FONT_STYLE_OPTION_TEXT_COLOR
            ]
    ) {
        title.setAttribute('fill', titleColor)
    } else {
        title.setAttribute('fill', titleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR])
    }

    title.setAttribute('data-test', 'visualization-title')

    if (config.title) {
        title.appendChild(document.createTextNode(config.title))

        svgWrapper.appendChild(title)
    }

    const subtitleFontStyle = mergeFontStyleWithDefault(
        fontStyle && fontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE],
        FONT_STYLE_VISUALIZATION_SUBTITLE
    )
    const subtitle = document.createElementNS(svgNS, 'text')
    subtitle.setAttribute(
        'x',
        getXFromTextAlign(subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN])
    )
    subtitle.setAttribute('y', 28)
    subtitle.setAttribute('dy', 22)
    subtitle.setAttribute(
        'text-anchor',
        getTextAnchorFromTextAlign(
            subtitleFontStyle[FONT_STYLE_OPTION_TEXT_ALIGN]
        )
    )
    subtitle.setAttribute(
        'font-size',
        `${subtitleFontStyle[FONT_STYLE_OPTION_FONT_SIZE]}px`
    )
    subtitle.setAttribute(
        'font-weight',
        subtitleFontStyle[FONT_STYLE_OPTION_BOLD]
            ? FONT_STYLE_OPTION_BOLD
            : 'normal'
    )
    subtitle.setAttribute(
        'font-style',
        subtitleFontStyle[FONT_STYLE_OPTION_ITALIC]
            ? FONT_STYLE_OPTION_ITALIC
            : 'normal'
    )

    if (
        titleColor &&
        subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR] ===
            defaultFontStyle[FONT_STYLE_VISUALIZATION_SUBTITLE][
                FONT_STYLE_OPTION_TEXT_COLOR
            ]
    ) {
        subtitle.setAttribute('fill', titleColor)
    } else {
        subtitle.setAttribute(
            'fill',
            subtitleFontStyle[FONT_STYLE_OPTION_TEXT_COLOR]
        )
    }

    subtitle.setAttribute('data-test', 'visualization-subtitle')

    if (config.subtitle) {
        subtitle.appendChild(document.createTextNode(config.subtitle))

        svgWrapper.appendChild(subtitle)
    }

    svg.appendChild(svgWrapper)

    svg.appendChild(
        generateValueSVG({
            formattedValue: config.formattedValue,
            icon: config.icon,
            subText: config.subText,
            valueColor,
            noData,
            containerWidth: width,
            containerHeight: height,
        })
    )

    return svg
}

const shouldUseContrastColor = (inputColor) => {
    // based on https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
    var color =
        inputColor.charAt(0) === '#' ? inputColor.substring(1, 7) : inputColor
    var r = parseInt(color.substring(0, 2), 16) // hexToR
    var g = parseInt(color.substring(2, 4), 16) // hexToG
    var b = parseInt(color.substring(4, 6), 16) // hexToB
    var uicolors = [r / 255, g / 255, b / 255]
    var c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92
        }
        return Math.pow((col + 0.055) / 1.055, 2.4)
    })
    var L = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    return L <= 0.179
}

export default function (
    config,
    parentEl,
    { legendSets, fontStyle, noData, legendOptions }
) {
    const legendSet = legendOptions && legendSets[0]
    const legendColor =
        legendSet && getColorByValueFromLegendSet(legendSet, config.value)
    let valueColor, titleColor
    if (legendColor) {
        if (legendOptions.style === LEGEND_DISPLAY_STYLE_FILL) {
            parentEl.style.background = legendColor
            valueColor = titleColor =
                shouldUseContrastColor(legendColor) && colors.white
        } else {
            valueColor = legendColor
        }
    }

    parentEl.style.overflow = 'hidden'
    parentEl.style.display = 'flex'
    parentEl.style.justifyContent = 'center'
    parentEl.style.borderRadius = spacers.dp8
    parentEl.style.margin = spacers.dp8
    parentEl.style.height = `calc(100% - (${spacers.dp8} * 2))`

    // TODO pass dashboard and toggle styles and other things not desired in dashboard...
    return generateItem(config, {
        valueColor,
        titleColor,
        parentEl,
        fontStyle,
        noData,
    })
}
