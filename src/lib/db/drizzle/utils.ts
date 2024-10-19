import { is, Subquery, SubqueryConfig, Table, View, ViewBaseConfig, } from "drizzle-orm";

export function getColumns<T extends Table | View | Subquery>(
	table: T,
): T extends Table ? T['_']['columns']
	: T extends View ? T['_']['selectedFields']
	: T extends Subquery ? T['_']['selectedFields']
	: never
{
	return is(table, Table)
		? table[Table.Symbol.Columns]
		: is(table, View)
		? table[ViewBaseConfig].selectedFields
		: (table[SubqueryConfig].selection as any);
}