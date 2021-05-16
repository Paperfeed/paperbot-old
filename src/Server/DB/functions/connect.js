import {
  Collection,
  Create,
  Do,
  Exists,
  If,
  Index,
  IsArray,
  Lambda,
  Let,
  Map,
  Match,
  Not,
  Query,
  Ref,
  Select,
  ToObject,
  Var,
} from 'faunadb'

export default {
  body: Query(
    Lambda(
      ['connections', 'id', 'collection'],
      If(
        IsArray(Var('connections')),
        Do(
          Map(
            Var('connections'),
            Lambda(
              ['parameters'],
              Let(
                {
                  connectFromId: Select(
                    'connectFromId',
                    Var('parameters'),
                    Var('id'),
                  ),
                  connectToCollection: Select(
                    'connectToCollection',
                    Var('parameters'),
                    '',
                  ),
                  connectToId: Select('connectToId', Var('parameters'), ''),
                  fromCollection: Select(
                    'fromCollection',
                    Var('parameters'),
                    Var('collection'),
                  ),
                  fromIdName: Select('fromIdName', Var('parameters'), ''),
                  indexName: Select('indexName', Var('parameters'), ''),
                  toCollection: Select('toCollection', Var('parameters'), ''),
                  toIdName: Select('toIdName', Var('parameters'), ''),
                },
                If(
                  Not(
                    Exists(
                      Match(
                        Index(Var('indexName')),
                        Ref(
                          Collection(Var('toCollection')),
                          Var('connectToId'),
                        ),
                      ),
                    ),
                  ),
                  Create(Collection(Var('connectToCollection')), {
                    data: ToObject([
                      [
                        Var('fromIdName'),
                        Ref(
                          Collection(Var('fromCollection')),
                          Var('connectFromId'),
                        ),
                      ],
                      [
                        Var('toIdName'),
                        Ref(
                          Collection(Var('toCollection')),
                          Var('connectToId'),
                        ),
                      ],
                    ]),
                  }),
                  'Link already exists',
                ),
              ),
            ),
          ),
        ),
        'No connections provided',
      ),
    ),
  ),
  name: 'connect',
}
