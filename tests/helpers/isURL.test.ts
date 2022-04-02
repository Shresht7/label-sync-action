//  Library
import { isURL } from '../../src/helpers/isURL'

describe('isURL', () => {

    it('should return true for a URL', () => {
        const url = 'https://www.github.com/Shresht7/markdown-slots'
        expect(isURL(url)).toBeTruthy()
    })

    it('should return false for a non URL string', () => {
        const str = 'Not a URL, I promise!'
        expect(isURL(str)).toBeFalsy()
    })

})