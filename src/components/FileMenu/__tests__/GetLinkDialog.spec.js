import { Button, Modal } from '@dhis2/ui'
import { shallow } from 'enzyme'
import React from 'react'
import { GetLinkDialog } from '../GetLinkDialog.js'
import { appPathFor } from '../utils.js'

describe('The FileMenu - GetLinkDialog component', () => {
    let shallowGetLinkDialog
    let props

    const onClose = jest.fn()

    const getGetLinkDialogComponent = (props) => {
        if (!shallowGetLinkDialog) {
            shallowGetLinkDialog = shallow(<GetLinkDialog {...props} />)
        }
        return shallowGetLinkDialog
    }

    beforeEach(() => {
        shallowGetLinkDialog = undefined
        props = {
            type: 'visualization',
            id: 'get-link-test-id',
            onClose,
        }
    })

    it('renders a Modal component', () => {
        expect(getGetLinkDialogComponent(props).find(Modal)).toHaveLength(1)
    })

    it('renders a <a> tag containing the type and id props', () => {
        const href = getGetLinkDialogComponent(props).find('a').prop('href')

        expect(href).toMatch(appPathFor(props.type, props.id))
    })

    it('calls the onClose callback when the Close button is clicked', () => {
        getGetLinkDialogComponent(props).find(Button).first().simulate('click')

        expect(onClose).toHaveBeenCalled()
    })
})
