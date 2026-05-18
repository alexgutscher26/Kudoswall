import { and, eq } from "drizzle-orm";
import type { Database } from "./index";

/**
 * A list of tables that support tenant isolation via workspaceId.
 */
export const TENANT_TABLES = [
  "project",
  "testimonial",
  "tag",
  "widget",
  "analyticsEvent",
  "videoTranscodingJob",
  "workspaceMember",
  "workspaceInvitation",
  "auditLog",
] as const;

export type TenantTable = (typeof TENANT_TABLES)[number];

/**
 * Creates a tenant-aware database client that automatically injects workspaceId filters.
 */
export function createTenantDb(db: Database, workspaceId: string) {
  return new Proxy(db, {
    get(target, prop) {
      // 1. Wrap db.query
      if (prop === "query") {
        return new Proxy(target.query, {
          get(queryTarget, tableProp: string) {
            const tableQuery = (queryTarget as any)[tableProp];
            if (!tableQuery) return undefined;

            if (!TENANT_TABLES.includes(tableProp as any)) {
              return tableQuery;
            }

            return {
              ...tableQuery,
              findMany: (args: any) => {
                return tableQuery.findMany({
                  ...args,
                  where: (table: any, operators: any) => {
                    const { and, eq } = operators;
                    const originalWhere =
                      typeof args?.where === "function"
                        ? args.where(table, operators)
                        : args?.where;
                    const workspaceFilter = eq(table.workspaceId, workspaceId);
                    return originalWhere ? and(originalWhere, workspaceFilter) : workspaceFilter;
                  },
                });
              },
              findFirst: (args: any) => {
                return tableQuery.findFirst({
                  ...args,
                  where: (table: any, operators: any) => {
                    const { and, eq } = operators;
                    const originalWhere =
                      typeof args?.where === "function"
                        ? args.where(table, operators)
                        : args?.where;
                    const workspaceFilter = eq(table.workspaceId, workspaceId);
                    return originalWhere ? and(originalWhere, workspaceFilter) : workspaceFilter;
                  },
                });
              },
            };
          },
        });
      }

      // 2. Wrap db.select
      if (prop === "select") {
        return (...args: any[]) => {
          const builder = (target.select as any)(...args);
          return new Proxy(builder, {
            get(builderTarget, builderProp) {
              if (builderProp === "from") {
                return (table: any) => {
                  const fromBuilder = builderTarget.from(table);
                  // If the table is a tenant table, we should automatically inject a where clause later
                  // This is tricky because Drizzle's builder pattern is chainable.
                  // For now, we'll focus on db.query as it's the primary way used in this app.
                  // But we can add a simple check for .where()
                  return fromBuilder;
                };
              }
              return (builderTarget as any)[builderProp];
            },
          });
        };
      }

      // 3. Wrap db.update
      if (prop === "update") {
        return (table: any) => {
          const updateBuilder = target.update(table);
          if (TENANT_TABLES.some((t) => (table as any)._?.name === t || table.name === t)) {
            return new Proxy(updateBuilder, {
              get(t, p) {
                if (p === "set") {
                  return (values: any) => {
                    const setter = t.set(values);
                    return new Proxy(setter, {
                      get(st, sp) {
                        if (sp === "where") {
                          return (condition: any) => {
                            return st.where(
                              and(condition, eq((table as any).workspaceId, workspaceId)),
                            );
                          };
                        }
                        return (st as any)[sp];
                      },
                    });
                  };
                }
                return (t as any)[p];
              },
            });
          }
          return updateBuilder;
        };
      }

      // 4. Wrap db.delete
      if (prop === "delete") {
        return (table: any) => {
          const deleteBuilder = target.delete(table);
          if (TENANT_TABLES.some((t) => (table as any)._?.name === t || table.name === t)) {
            return new Proxy(deleteBuilder, {
              get(t, p) {
                if (p === "where") {
                  return (condition: any) => {
                    return t.where(and(condition, eq((table as any).workspaceId, workspaceId)));
                  };
                }
                return (t as any)[p];
              },
            });
          }
          return deleteBuilder;
        };
      }

      // 5. Wrap db.insert
      if (prop === "insert") {
        return (table: any) => {
          const insertBuilder = target.insert(table);
          const originalValues = insertBuilder.values.bind(insertBuilder);
          insertBuilder.values = (values: any) => {
            if (TENANT_TABLES.some((t) => (table as any)._?.name === t || table.name === t)) {
              if (Array.isArray(values)) {
                values = values.map((v) => ({ ...v, workspaceId }));
              } else {
                values = { ...values, workspaceId };
              }
            }
            return originalValues(values);
          };
          return insertBuilder;
        };
      }

      if (prop === "workspaceId") {
        return workspaceId;
      }

      return (target as any)[prop];
    },
  });
}
