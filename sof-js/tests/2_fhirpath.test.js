import { describe } from 'bun:test'
import { start_case, end_case, add_test } from './test_helpers.js'

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    managingOrganization: { reference: 'Organization/o1' },
    name: [
      {
        family: 'f1.1',
        use: 'official',
        given: ['g1.1.1', 'g1.1.2'],
      },
      {
        family: 'f1.2',
        given: ['g1.2.1'],
      },
    ],
    active: true,
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    managingOrganization: { reference: 'http://myapp.com/prefix/Organization/o2' },
    name: [
      { family: 'f2.1' },
      {
        family: 'f2.2',
        use: 'official',
      },
    ],
    active: false,
  },
  {
    resourceType: 'Patient',
    id: 'pt3',
  },
]

start_case('fhirpath', 'fhirpath features', resources)

describe('fhirpath', () => {
  add_test({
    title: 'one element',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'id', path: 'id' }] }],
    },
    expect: [{ id: 'pt1' }, { id: 'pt2' }, { id: 'pt3' }],
  })

  add_test({
    title: 'two elements + first',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: 'name.family.first()' }] }],
    },
    expect: [{ v: 'f1.1' }, { v: 'f2.1' }, { v: null }],
  })

  add_test({
    title: 'collection',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: 'name.family', collection: true }] }],
    },
    expect: [{ v: ['f1.1', 'f1.2'] }, { v: ['f2.1', 'f2.2'] }, { v: [] }],
  })

  add_test({
    title: 'index[0]',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: 'name[0].family' }] }],
    },
    expect: [{ v: 'f1.1' }, { v: 'f2.1' }, { v: null }],
  })

  add_test({
    title: 'index[1]',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: 'name[1].family' }] }],
    },
    expect: [{ v: 'f1.2' }, { v: 'f2.2' }, { v: null }],
  })

  add_test({
    title: 'out of index',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: 'name[2].family' }] }],
    },
    expect: [{ v: null }, { v: null }, { v: null }],
  })

  add_test({
    title: 'where',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [{ column: [{ name: 'v', path: "name.where(use='official').family" }] }],
    },
    expect: [{ v: 'f1.1' }, { v: 'f2.2' }, { v: null }],
  })

  add_test({
    title: 'exists',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'has_name', path: 'name.exists()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', has_name: true },
      { id: 'pt2', has_name: true },
      { id: 'pt3', has_name: false },
    ],
  })

  add_test({
    title: 'nested exists',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'has_given', path: 'name.given.exists()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', has_given: true },
      { id: 'pt2', has_given: false },
      { id: 'pt3', has_given: false },
    ],
  })

  add_test({
    title: 'string join',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'given', path: "name.given.join(', ' )" },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', given: 'g1.1.1, g1.1.2, g1.2.1' },
      { id: 'pt2', given: '' },
      { id: 'pt3', given: '' },
    ],
  })

  add_test({
    title: 'string join: default separator',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            { name: 'given', path: 'name.given.join()' },
          ],
        },
      ],
    },
    expect: [
      { id: 'pt1', given: 'g1.1.1g1.1.2g1.2.1' },
      { id: 'pt2', given: '' },
      { id: 'pt3', given: '' },
    ],
  })

  end_case()
})
