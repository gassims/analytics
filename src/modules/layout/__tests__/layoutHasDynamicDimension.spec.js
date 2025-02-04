import { AXIS, AXIS_ID_FILTERS } from '../axis.js'
import { layoutHasDynamicDimension } from '../layoutHasDynamicDimension.js'
import { TEST_LAYOUT } from '../testResources.js'

describe('layoutHasDynamicDimension', () => {
    it('should return true if a dynamic dimension id is found in the layout, otherwise false', () => {
        expect(layoutHasDynamicDimension(TEST_LAYOUT)).toBe(true)

        const layoutWithoutDynamicDimension = {
            ...TEST_LAYOUT,
            [AXIS_ID_FILTERS]: AXIS.defaultValue,
        }

        expect(layoutHasDynamicDimension(layoutWithoutDynamicDimension)).toBe(
            false
        )
    })
})
