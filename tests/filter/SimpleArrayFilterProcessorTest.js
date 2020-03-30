import { SimpleArrayFilterProcessor } from '../../src'

test('SimpleArrayFilterProcessor default values', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  expect(filterProcessor.name).toEqual('SimpleArrayFilter')
  expect(filterProcessor.delimiter).toEqual(';')
})

test('SimpleArrayFilterProcessor with other name', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor({
    name: 'GumboFilter',
  })

  expect(filterProcessor.name).toEqual('GumboFilter')
})

test('SimpleArrayFilterProcessor with other delimiter', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor({ delimiter: ',' })

  expect(filterProcessor.delimiter).toEqual(',')
})

test('filter: empty expression are always false', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  const tags = []
  const expression = ''
  const res = filterProcessor.filter(tags, expression)

  expect(res).toBeFalsy()
})

test('filter: empty tags are always false', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  const tags = []
  const expression = 'Prio1'
  const res = filterProcessor.filter(tags, expression)

  expect(res).toBeFalsy()
})

test('filter: many tags one matching expression', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  const tags = ['Prio 1', 'Prio 2', 'Prio 3', 'Prio 4']
  const expression = 'Prio 3'
  const res = filterProcessor.filter(tags, expression)

  expect(res).toBeTruthy()
})

test('filter: many tags one matching expression other not matching', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  const tags = ['Prio 1', 'Prio 2', 'Prio 3', 'Prio 4']
  const expression = ' Prio 3 ; gumbo'
  const res = filterProcessor.filter(tags, expression)

  expect(res).toBeTruthy()
})

test('filter: many tags no matching expression at all ', async () => {
  const filterProcessor = new SimpleArrayFilterProcessor()

  const tags = ['Prio 1', 'Prio 2', 'Prio 3', 'Prio 4']
  const expression = ' Prio ; gumbo; Prio 5'
  const res = filterProcessor.filter(tags, expression)

  expect(res).toBeFalsy()
})
