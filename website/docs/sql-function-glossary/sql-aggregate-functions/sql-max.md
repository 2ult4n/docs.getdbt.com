---
id: sql-max
title: SQL MAX
description: The SQL MAX aggregate function allows you to compute the maximum value from a column.
slug: /sql-function-glossary/sql-max
---

<head>
    <title>Working with the SQL MAX function</title>
</head>

The SQL MAX aggregate function allows you to compute the maximum value from a column. This kind of measure is useful for understanding the distribution of column values, determining the most recent timestamps of key events, and creating booleans from CASE WHEN statements.

## How to use the SQL MAX function in a query

Use the following syntax to find the maximum value of a field:

`max(<field_name>)`

Since MAX is an aggregate function, you’ll need a GROUP BY statement in your query if you’re looking at counts broken out by dimension(s). If you’re calculating the standalone maximum of fields without the need to break them down by another field, you don’t need a GROUP BY statement.

MAX can also be used as a window function to operate across specified or partitioned rows.

Let’s take a look at a practical example using MAX and GROUP BY below.

### MAX example

```sql
select
	date_part('month', order_date) as order_month,
	max(amount) as max_amaount
from {{ ref('orders') }}
group by 1
```

This simple query is something you may do while doing initial exploration of your data; it will return the maximum order `amount` per order month that appear in the [Jaffle Shop’s](https://github.com/dbt-labs/jaffle_shop) `orders` table:

| order_month | max_amount |
|:---:|:---:|
| 1 | 58 |
| 2 | 30 |
| 3 | 56 |
| 4 | 26 |

## SQL MAX function syntax in Snowflake, Databricks, BigQuery, and Redshift

All modern data warehouses support the ability to use the MAX function (and follow the same syntax!).

## MAX function use cases

We most commonly see queries using MAX to:

- Perform initial data exploration on a dataset to understand the distribution of column values.
- Identify the most recent timestamp for key events (ex. `max(login_timestamp_utc) as last_login`) using a MAX window function.
- Create descriptive boolean values from case when statements (ex. `max(case when status = ‘complete’ then 1 else 0 end) as has_complete_order`).
- Establish the most recent timestamp from a table to filter on rows appropriately for [incremental model builds](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/configuring-incremental-models).

This isn’t an extensive list of where your team may be using MAX throughout your development work, dbt models, and BI tool logic, but it contains some common scenarios analytics engineers face day-to-day.