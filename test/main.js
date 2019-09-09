const assert = require('assert')
const {
    unlinkSync,
} = require('fs')
const Memiens = require('../').default

const filename = './test.yaml'
const deleteFile = () => {
    try {
        // Remove the test file
        unlinkSync(filename)
    } catch (e) {
    }
}

describe('Memiens', () => {

    after(deleteFile)

    describe('Basics', () => {
        deleteFile()
        it('Instantiating without existing file', () => {
            const Settings = new Memiens(filename)
        })

        it('Saving simple string', () => {
            const Settings = new Memiens(filename)

            const key = 'test'
            const value = 'ok'
            Settings.set(key, value)

            assert.strictEqual(Settings.get(key), value)
        })
    })

    describe('Preserve types', () => {
        const Settings = new Memiens(filename)
        const key = 'key'

        const test = (value) => {
            Settings.set(key, value)
            const saved = Settings.get(key)
            assert.strictEqual(saved, value)
        }

        it('string', () => {
            test('my string')
        })

        it('string array', () => {
            test(['my string', 'ohlala'])
        })

        it('number', () => {
            test(42)
        })

        it('number array', () => {
            test([42, 8])
        })

        it('boolean', () => {
            test(true)
        })

        it('boolean array', () => {
            test([true, false])
        })

        it('mixed', () => {
            test(['a', 42, true])
        })

    })

    describe('Persist', () => {
        deleteFile()

        const key = 'test'
        const value = 42

        it('Write', () => {
            const Settings = new Memiens(filename)
            Settings.set(key, value)
        })

        it('Read', () => {
            const Settings = new Memiens(filename)
            assert.strictEqual(Settings.get(key), value)
        })
    })

    describe('Nested properties', () => {
        deleteFile()

        const data = {
            a: {
                b: {
                    c: [8, false],
                },
            },
        }

        it('Write', () => {
            const Settings = new Memiens(filename)
            Settings.set('a.b.c', data.a.b.c)
        })

        it('Read', () => {
            const Settings = new Memiens(filename)
            assert.deepStrictEqual(Settings.get('a'), data.a)
            assert.deepStrictEqual(Settings.get('a.b'), data.a.b)
            assert.deepStrictEqual(Settings.get('a.b.c'), data.a.b.c)
        })
    })

    describe('Get with initializer', () => {
        deleteFile()

        const key = 'initialized.nested'
        const value = 42

        it('Getting', () => {
            const Settings = new Memiens(filename)
            assert.strictEqual(Settings.get(key, value), value)
        })

        it('Verify it was written', () => {
            const Settings = new Memiens(filename)
            assert.strictEqual(Settings.get(key), value)
        })
    })

})