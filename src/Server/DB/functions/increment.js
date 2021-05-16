import {
  Add,
  Call,
  Collection,
  ContainsPath,
  Create,
  Do,
  Exists,
  Get,
  If,
  Lambda,
  Let,
  Map,
  Query,
  Ref,
  Select,
  ToArray,
  ToObject,
  Update,
  Var,
} from 'faunadb'

export default {
  body: Query(
    Lambda(
      ['collection', 'id', 'data', 'connections'],
      Let(
        {
          documentRef: Ref(Collection(Var('collection')), Var('id')),
        },
        Do(
          If(
            Exists(Var('documentRef')),
            // Ref exists, loop through data and increment existing values
            Let(
              {
                updatedData: ToObject(
                  Map(
                    ToArray(Var('data')),
                    Lambda(
                      ['key', 'value'],
                      Let(
                        {
                          documentData: Get(Var('documentRef')),
                        },
                        If(
                          ContainsPath(
                            ['data', Var('key')],
                            Var('documentData'),
                          ),
                          [
                            Var('key'),
                            Add(
                              Select(['data', Var('key')], Var('documentData')),
                              Var('value'),
                            ),
                          ],
                          [Var('key'), Var('value')],
                        ),
                      ),
                    ),
                  ),
                ),
              },
              Update(Var('documentRef'), { data: Var('updatedData') }),
            ),
            // Ref doesn't exists, create it
            Create(Collection(Var('collection')), {
              data: Var('data'),
              id: Var('id'),
            }),
          ),
          Do(
            Call('connect', [Var('connections'), Var('id'), Var('collection')]),
            Get(Var('documentRef')),
          ),
        ),
      ),
    ),
  ),
  name: 'increment',
}
