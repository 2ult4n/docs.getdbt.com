---
title: "Exclude"
---

### Excluding models
dbt provides an `--exclude` flag with the same semantics as `--select`. Models specified with the `--exclude` flag will be removed from the set of models selected with `--select`.

<Tabs
  defaultValue="modern"
  values={[
    { label: 'v0.21.0 and later', value: 'modern', },
    { label: 'v0.20.x and earlier', value: 'legacy', }
  ]
}>
<TabItem value="modern">

  ```bash
  $ dbt run --select my_package.*+ --exclude my_package.a_big_model+
  ```

</TabItem>
<TabItem value="legacy">

  ```bash
  $ dbt run --models my_package.*+ --exclude my_package.a_big_model+
  ```

</TabItem>
</Tabs>


Exclude a specific resource by its name or lineage:

```bash
# test
$ dbt test --exclude not_null_orders_order_id
$ dbt test --exclude orders

# seed
$ dbt seed --exclude account_parent_mappings

# snapshot
$ dbt snapshot --exclude snap_order_statuses
$ dbt test --exclude orders+
```
