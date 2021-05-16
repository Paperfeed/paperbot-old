import {
  Call,
  Collection,
  Create,
  Do,
  Exists,
  Get,
  If,
  Lambda,
  Let,
  Merge,
  Query,
  Ref,
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
            Update(Var('documentRef'), {
              data: Var('data'),
            }),
            Create(Var('documentRef'), {
              data: Merge(Var('data'), { id: Var('id') }),
            }),
          ),
          Call('connect', [Var('connections'), Var('id'), Var('collection')]),
          Get(Var('documentRef')),
        ),
      ),
    ),
  ),
  name: 'upsert',
}
