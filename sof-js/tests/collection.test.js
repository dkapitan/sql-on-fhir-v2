import { describe } from 'bun:test'
import { add_test, add_throwing_test, end_case, start_case } from './test_helpers'

let resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    name: [
      {
        use: 'official',
        family: 'f1.1',
        given: ['g1.1'],
      },
      {
        family: 'f1.2',
        given: ['g1.2', 'g1.3'],
      },
    ],
    gender: 'male',
    birthDate: '1950-01-01',
    address: [{ city: 'c1' }],
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    name: [
      {
        family: 'f2.1',
        given: ['g2.1'],
      },
      {
        use: 'official',
        family: 'f2.2',
        given: ['g2.2', 'g2.3'],
      },
    ],
    gender: 'female',
    birthDate: '1950-01-01',
  },
]

start_case('collection', 'TBD', resources)

describe('collection', () => {
  add_throwing_test({
    title: "fail when 'collection' is not true",
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'last_name',
              path: 'name.family',
              collection: false,
            },
            {
              name: 'first_name',
              path: 'name.given',
              collection: true,
            },
          ],
        },
      ],
    },
    expectError: true,
  })

  add_test({
    title: 'collection = true',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [
            { name: 'id', path: 'id' },
            {
              name: 'last_name',
              path: 'name.family',
              collection: true,
            },
            {
              name: 'first_name',
              path: 'name.given',
              collection: true,
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        last_name: ['f1.1', 'f1.2'],
        first_name: ['g1.1', 'g1.2', 'g1.3'],
      },
      {
        id: 'pt2',
        last_name: ['f2.1', 'f2.2'],
        first_name: ['g2.1', 'g2.2', 'g2.3'],
      },
    ],
  })

  add_test({
    title: 'collection = false relative to forEach parent',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          select: [
            {
              forEach: 'name',
              column: [
                {
                  name: 'last_name',
                  path: 'family',
                  collection: false,
                },
                {
                  name: 'first_name',
                  path: 'given',
                  collection: true,
                },
              ],
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        last_name: 'f1.1',
        first_name: ['g1.1'],
      },
      {
        id: 'pt1',
        last_name: 'f1.2',
        first_name: ['g1.2', 'g1.3'],
      },
      {
        id: 'pt2',
        last_name: 'f2.1',
        first_name: ['g2.1'],
      },
      {
        id: 'pt2',
        last_name: 'f2.2',
        first_name: ['g2.2', 'g2.3'],
      },
    ],
  })

  add_test({
    title: 'collection = false relative to forEachOrNull parent',
    view: {
      resource: 'Patient',
      status: 'active',
      select: [
        {
          column: [{ name: 'id', path: 'id' }],
          select: [
            {
              forEach: 'name',
              column: [
                {
                  name: 'last_name',
                  path: 'family',
                  collection: false,
                },
                {
                  name: 'first_name',
                  path: 'given',
                  collection: true,
                },
              ],
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        last_name: 'f1.1',
        first_name: ['g1.1'],
      },
      {
        id: 'pt1',
        last_name: 'f1.2',
        first_name: ['g1.2', 'g1.3'],
      },
      {
        id: 'pt2',
        last_name: 'f2.1',
        first_name: ['g2.1'],
      },
      {
        id: 'pt2',
        last_name: 'f2.2',
        first_name: ['g2.2', 'g2.3'],
      },
    ],
  })

  end_case()
})
