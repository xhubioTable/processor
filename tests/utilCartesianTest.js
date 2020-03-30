import { cartesianProduct } from '../src/utilCartesian'

const TEST_DATA = [
  [[[1, 2, 3]], [1, 2, 3], 'single array'],
  [
    [
      [1, 2, 3],
      ['a', 'b', 'c'],
    ],
    [
      [1, 'a'],
      [1, 'b'],
      [1, 'c'],
      [2, 'a'],
      [2, 'b'],
      [2, 'c'],
      [3, 'a'],
      [3, 'b'],
      [3, 'c'],
    ],
    'two arrays',
  ],
  [
    [
      [1, 2, 3],
      ['a', 'b', 'c'],
      ['x', 'y'],
    ],
    [
      [1, 'a', 'x'],
      [1, 'a', 'y'],
      [1, 'b', 'x'],
      [1, 'b', 'y'],
      [1, 'c', 'x'],
      [1, 'c', 'y'],
      [2, 'a', 'x'],
      [2, 'a', 'y'],
      [2, 'b', 'x'],
      [2, 'b', 'y'],
      [2, 'c', 'x'],
      [2, 'c', 'y'],
      [3, 'a', 'x'],
      [3, 'a', 'y'],
      [3, 'b', 'x'],
      [3, 'b', 'y'],
      [3, 'c', 'x'],
      [3, 'c', 'y'],
    ],
    'three arrays',
  ],
]

for (const testData of TEST_DATA) {
  const input = testData[0]
  const expected = testData[1]
  const name = testData[2]
  test(`${name}`, () => {
    const result = cartesianProduct(...input)
    expect(result).toEqual(expected)
  })
}
