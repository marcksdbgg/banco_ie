type QueryOp = 'select' | 'update' | 'insert' | 'delete'
type SingleMode = 'none' | 'single' | 'maybeSingle'

export type DbQueryState = {
  table: string
  op: QueryOp
  columns?: string
  values?: Record<string, unknown> | Record<string, unknown>[]
  filters: Array<
    | { type: 'eq'; column: string; value: unknown }
    | { type: 'in'; column: string; values: unknown[] }
    | { type: 'or'; raw: string }
  >
  orderBy?: { column: string; ascending: boolean }
  limit?: number
  single: SingleMode
  countExactHead?: boolean
}

type QueryResponse =
  | { data: unknown; error: null; count?: number | null }
  | { data: null; error: { message: string }; count?: null }

type QueryExecutor = (state: DbQueryState) => Promise<QueryResponse>

class DbQueryBuilder {
  private state: DbQueryState
  private readonly executeFn: QueryExecutor

  constructor(table: string, executeFn: QueryExecutor) {
    this.executeFn = executeFn
    this.state = {
      table,
      op: 'select',
      filters: [],
      single: 'none',
    }
  }

  select(columns: string, options?: { count?: 'exact'; head?: boolean }) {
    this.state.op = 'select'
    this.state.columns = columns
    this.state.countExactHead = options?.count === 'exact' && options?.head === true
    return this
  }

  update(values: Record<string, unknown>) {
    this.state.op = 'update'
    this.state.values = values
    return this
  }

  insert(values: Record<string, unknown> | Record<string, unknown>[]) {
    this.state.op = 'insert'
    this.state.values = values
    return this
  }

  delete() {
    this.state.op = 'delete'
    return this
  }

  eq(column: string, value: unknown) {
    this.state.filters.push({ type: 'eq', column, value })
    return this
  }

  in(column: string, values: unknown[]) {
    this.state.filters.push({ type: 'in', column, values })
    return this
  }

  or(raw: string) {
    this.state.filters.push({ type: 'or', raw })
    return this
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.state.orderBy = { column, ascending: options?.ascending ?? true }
    return this
  }

  limit(value: number) {
    this.state.limit = value
    return this
  }

  async single() {
    this.state.single = 'single'
    return this.executeFn(this.state)
  }

  async maybeSingle() {
    this.state.single = 'maybeSingle'
    return this.executeFn(this.state)
  }

  then<TResult1 = QueryResponse, TResult2 = never>(
    onfulfilled?: ((value: QueryResponse) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    return this.executeFn(this.state).then(onfulfilled, onrejected)
  }
}

export function createDbFromFactory(executeFn: QueryExecutor) {
  return (table: string) => new DbQueryBuilder(table, executeFn)
}
