//  Library
import { labelSorter } from '../../src/helpers/labelSorter'
import type { LabelMap } from '../../src/types'

const labels: LabelMap = new Map()
const newLabels: LabelMap = new Map()

describe('Label Sorter', () => {

    beforeAll(() => {
        labels
            .set('bug', {
                name: 'bug',
                description: 'Something to fix',
                color: 'FF0000'
            })
            .set('enhancement', {
                name: 'enhancement',
                description: 'Something to improve',
                color: '0000FF'
            })
    })

    beforeEach(() => {
        newLabels.clear()
        labels.forEach(label => newLabels.set(label.name, label))
    })

    it('should put new labels in createLabels', () => {
        newLabels.set('new', { name: 'new', description: 'new', color: '00FF00' })
        const { createLabels, updateLabels, deleteLabels } = labelSorter(labels, newLabels)
        expect(createLabels).toStrictEqual(['new'])
        expect(updateLabels).toStrictEqual([])
        expect(deleteLabels).toStrictEqual([])
    })

    it('should put existing labels in updateLabels', () => {
        newLabels.set('bug', { name: 'bug', description: 'new bug', color: '00FF00' })
        const { createLabels, updateLabels, deleteLabels } = labelSorter(labels, newLabels)
        expect(createLabels).toStrictEqual([])
        expect(updateLabels).toStrictEqual(['bug'])
        expect(deleteLabels).toStrictEqual([])
    })

    it('should put removed labels in deleteLabels', () => {
        newLabels.delete('bug')
        const { createLabels, updateLabels, deleteLabels } = labelSorter(labels, newLabels)
        expect(createLabels).toStrictEqual([])
        expect(updateLabels).toStrictEqual([])
        expect(deleteLabels).toStrictEqual(['bug'])
    })

})