import { describe } from 'bun:test'
import { add_test, end_case, start_case } from './test_helpers'

const resources = [
  {
    resourceType: 'Patient',
    id: 'pt1',
    meta: {
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
    },
    extension: [
      {
        id: 'birthsex',
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCode: 'F',
      },
      {
        id: 'race',
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
        extension: [
          {
            url: 'ombCategory',
            valueCoding: {
              system: 'urn:oid:2.16.840.1.113883.6.238',
              code: '2106-3',
              display: 'White',
            },
          },
          {
            url: 'text',
            valueString: 'Mixed',
          },
        ],
      },
      {
        id: 'sex',
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-sex',
        valueCode: '248152002',
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt2',
    meta: {
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
    },
    extension: [
      {
        id: 'birthsex',
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex',
        valueCode: 'M',
      },
      {
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-race',
        id: 'race',
        extension: [
          {
            url: 'ombCategory',
            valueCoding: {
              system: 'urn:oid:2.16.840.1.113883.6.238',
              code: '2135-2',
              display: 'Hispanic or Latino',
            },
          },
          {
            url: 'text',
            valueString: 'Mixed',
          },
        ],
      },
      {
        id: 'sex',
        url: 'http://hl7.org/fhir/us/core/StructureDefinition/us-core-sex',
        valueCode: '248152002',
      },
    ],
  },
  {
    resourceType: 'Patient',
    id: 'pt3',
    meta: {
      profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient'],
    },
    extension: [],
  },
]

start_case('fn_extension', 'TBD', resources)

describe('extension function', () => {
  add_test({
    title: 'simple extension',
    description: 'flatten simple extension',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [
            {
              path: 'id',
              name: 'id',
            },
            {
              name: 'birthsex',
              path: "extension('http://hl7.org/fhir/us/core/StructureDefinition/us-core-birthsex').value.ofType(code).first()",
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        birthsex: 'F',
      },
      {
        id: 'pt2',
        birthsex: 'M',
      },
      {
        id: 'pt3',
        birthsex: null,
      },
    ],
  })

  add_test({
    title: 'nested extension',
    description: 'flatten simple extension',
    view: {
      resource: 'Patient',
      select: [
        {
          column: [
            {
              path: 'id',
              name: 'id',
            },
            {
              name: 'race_code',
              path: "extension('http://hl7.org/fhir/us/core/StructureDefinition/us-core-race').extension('ombCategory').value.ofType(Coding).code.first()",
            },
          ],
        },
      ],
    },
    expect: [
      {
        id: 'pt1',
        race_code: '2106-3',
      },
      {
        id: 'pt2',
        race_code: '2135-2',
      },
      {
        id: 'pt3',
        race_code: null,
      },
    ],
  })

  end_case()
})
