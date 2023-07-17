---
title: "Get started with the dbt Semantic Layer"
id: quickstart-sl
description: "Use this guide to build and define metrics, set up the dbt Semantic Layer, and query them using the Semantic Layer APIs."
sidebar_label: "Get started with the dbt Semantic Layer"
---

<VersionBlock firstVersion="1.6">

import NewSLChanges from '/snippets/_new-sl-changes.md';

<NewSLChanges />

The dbt Semantic Layer, powered by [MetricFlow](/docs/build/about-metricflow), simplifies defining and using critical business metrics. It centralizes metric definitions, eliminates duplicate coding, and ensures consistent self-service access to metrics in downstream tools. 

MetricFlow is a powerful component within the dbt Semantic Layer that helps users define and manage company metrics efficiently. It provides flexible abstractions and SQL query generation, and also allows data consumers to retrieve metric datasets quickly and easily from a data platform.

Use this guide to fully experience the power of a universal dbt Semantic Layer. Here are the following steps you'll take:

- [Create a semantic model](#create-a-semantic-model) with MetricFlow
- [Create your metrics](#create-your-metrics) with MetricFlow
- [Run your production job](#run-your-production-job) in dbt Cloud
- [Set up dbt Semantic Layer](#setup) in dbt Cloud
- [Connect to the Semantic Layer APIs](#connect-to-apis)
- [Query your metrics using partner integrations](#query-metrics)



## Prerequisites

import SetUp from '/snippets/_v2-sl-prerequisites.md';

<SetUp />

:::tip 
New to dbt or metrics? Try our [Jaffle shop example project](https://github.com/dbt-labs/jaffle-sl-template) to help you get started!
:::

## Create a semantic model

Before you begin, we recommend you learn about more about [MetricFlow](/docs/build/about-metricflow) and its key concepts. There are two main objects: 

- [Semantic models](/docs/build/semantic-models) &mdash; Nodes in your semantic graph, connected via entities as edges. MetricFlow takes semantic models defined in YAML configuration files as inputs and creates a semantic graph that you can use to query metrics. 
- [Metrics](/docs/build/metrics-overview) &mdash; Can be defined in the same YAML files as your semantic models, or split into separate YAML files into any other subdirectories (provided that these subdirectories are also within the same dbt project repo).

This step will guide you through setting up your semantic models, which consist of [entities](/docs/build/entities), [dimensions](/docs/build/dimensions), and [measures](/docs/build/measures).

1. Name your semantic model, fill in appropriate metadata, and map it to a model in your dbt project. 

```yaml
semantic_models:
  - name: transactions
    description: |
    This table captures every transaction starting July 02, 2014. Each row represents one transaction
    model: ref('fact_transactions')
  ```

2. Define your entities. These are the keys in your table that MetricFlow will use to join other semantic models. These are usually columns like `customer_id`, `transaction_id`, and so on.

```yaml
  entities:
    - name: transaction
      type: primary
      expr: id_transaction
    - name: customer
      type: foreign
      expr: id_customer
  ```

3. Define your dimensions and measures. dimensions are properties of the records in your table that are non-aggregatable. They provide categorical or time-based context to enrich metrics. Measures are the building block for creating metrics. They are numerical columns that MetricFlow aggregates to create metrics.

```yaml
measures:
    - name: transaction_amount_usd
      description: The total USD value of the transaction.
      agg: sum
  dimensions:
    - name: is_large
      type: categorical
      expr: case when transaction_amount_usd >= 30 then true else false end
```

:::tip

If you're familiar with writing SQL, you can think of dimensions as the columns you would group by and measures as the columns you would aggregate.
```sql
select
  metric_time_day,  -- time
  country,  -- categorical dimension
  sum(revenue_usd) -- measure
from
  snowflake.fact_transactions  -- sql table
group by metric_time_day, country  -- dimensions
  ```
:::

## Define metrics

Now that you've created your first semantic model, it's time to define your first metric. MetricFlow supports different metric types like [simple](/docs/build/simple), [ratio](/docs/build/ratio), [cumulative](/docs/build/cumulative), and [derived](/docs/build/derived). You can define metrics in the same YAML files as your semantic models, or create a new file.

The example metric we'll create is a simple metric that refers directly to a measure, based on the `transaction_amount_usd` measure, which will be implemented as a `sum()` function in SQL.

```yaml
---
metrics:
  - name: transaction_amount_usd
    type: simple
    type_params:
    measure: transaction_amount_usd
```
 
1. Click **Save** and then **Preview** the code in the dbt Cloud IDE.
2. Run `mf query --metrics <metric_name> --group-by <dimension_name>` to manually query the metrics and dimensions in the IDE.
3. Run `mf validate-configs` to validate the changes before committing them.
4. Commit and merge the code changes that contain the metric definitions.

To continue building out your metrics based on your organization's needs, refer to the [Build your metrics](/docs/build/build-metrics-intro) for detailed info on how to define different metric types and semantic models.

## Run a production job

Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the navigation header
2. Select **Jobs** to re-run the job with the most recent code in the deployment environment.
3. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" width="85%" title="DAG with metrics appearing as a red node" />


<details>

<summary>What’s happening internally?</summary>
- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the manifest produced by the run. <br />
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure that the manifest is up to date.<br />
- The Semantic Layer APIs pulls in the most recent manifest and allows your integration information to extract metadata from it.
</details>

## Set up dbt Semantic Layer

import SlSetUp from '/snippets/_new-sl-setup.md';  

<SlSetUp/>


## Connect to the APIs

add content here

## Query your metrics 

add content

## FAQs

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>The dbt Semantic Layer does not store, or cache, or log your data. On each query to the Semantic Layer, the resulting data passes through dbt Cloud servers where it is never stored, cached, or logged. The data from your data platform gets routed through dbt Cloud servers, to your connecting data tool.</div>
  </div>
</details>
<details>
    <summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL-licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Discovery API are not open sources. <br></br><br></br>

During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise).<br></br><br></br>
<ul>    
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, you will need to have a dbt Cloud account.</li><br></br><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API.</li><br></br><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Discovery API in the integrated partner tool to import metric definitions.</li>
    </ul>
    </div>
    </div>
</details>

   
## Next steps

Are you ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer.

- [Set up dbt Semantic Layer](docs/use-dbt-semantic-layer/setup-dbt-sl)
- [Build your metrics](/docs/build/build-metrics-intro)
- [About MetricFlow](/docs/build/about-metricflow)
- [Available integrations](/docs/use-dbt-semantic-layer/avail-sl-integrations)

</VersionBlock>

<VersionBlock lastVersion="1.5">

import LegacyInfo from '/snippets/_legacy-sl-callout.md';

<LegacyInfo />

To try out the features of the dbt Semantic Layer, you first need to have a dbt project set up. This quickstart guide will lay out the following steps, and recommends a workflow that demonstrates some of its essential features:

- Install dbt metrics package
- Define metrics
- Query, and run metrics
- Configure the dbt Semantic Layer

## Prerequisites
To use the dbt Semantic Layer, you’ll need to meet the following:

<Snippet path="sl-prerequisites" />

<Snippet path="sl-considerations-banner" />


:::info 📌 

New to dbt or metrics? Check out our [quickstart guide](/quickstarts) to build your first dbt project! If you'd like to define your first metrics, try our [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example project.

:::

## Installing dbt metrics package
The dbt Semantic Layer supports the calculation of metrics by using the [dbt metrics package](https://hub.getdbt.com/dbt-labs/metrics/latest/). You can install the dbt metrics package in your dbt project by copying the below code blocks.

<VersionBlock firstVersion="1.3" lastVersion="1.3">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=1.3.0", "<1.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.2" lastVersion="1.2">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.3.0", "<0.4.0"]
```

</VersionBlock>

<VersionBlock firstVersion="1.1" lastVersion="1.1">

```yml
packages:
  - package: dbt-labs/metrics
    version: [">=0.2.0", "<0.3.0"]
```

</VersionBlock>  


1. Paste the dbt metrics package code in your `packages.yml` file.
2. Run the [`dbt deps` command](/reference/commands/deps) to install the package.
3. If you see a successful result, you have now installed the dbt metrics package successfully! 
4. If you have any errors during the `dbt deps` command run, review the system logs for more information on how to resolve them.  Make sure you use a dbt metrics package that’s compatible with your dbt environment version. 

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_package.png" title="Running dbt deps in the dbt Cloud IDE" />

## Design and define metrics

Review our helpful metrics video below, which explains what metrics are, why they're important and how you can get started:
    
<LoomVideo id="b120ca9d042d46abad1d873a676bf20a" />    

### Design metrics
    
To read about best practices on structuring and organizing your metrics, review our [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog post first.

### Define metrics
Now that you've organized your metrics folder and files, you can define your metrics in `.yml` files nested under a `metrics` key.  

1. Add the metric definitions found in the [Jaffle Shop](https://github.com/dbt-labs/jaffle_shop_metrics) example to your dbt project. For example, to add an expenses metric, reference the following metrics you can define directly in your metrics folder: 
      
<VersionBlock firstVersion="1.3">

```sql
version: 2

metrics:
  - name: expenses
    label: Expenses
    model: ref('orders')
    description: "The total expenses of our jaffle business"

    calculation_method: sum
    expression: amount / 4

    timestamp: order_date
    time_grains: [day, week, month, year]

    dimensions:
      - customer_status
      - had_credit_card_payment
      - had_coupon_payment
      - had_bank_transfer_payment
      - had_gift_card_payment

    filters:
      - field: status
        operator: '='
        value: "'completed'"
```
</VersionBlock> 

<VersionBlock lastVersion="1.2">

```sql
version: 2

metrics:
  - name: expenses
    label: Expenses
    model: ref('orders')
    description: "The total expenses of our jaffle business"

    type: sum
    sql: amount / 4

    timestamp: order_date
    time_grains: [day, week, month, year]

    dimensions:
      - customer_status
      - had_credit_card_payment
      - had_coupon_payment
      - had_bank_transfer_payment
      - had_gift_card_payment

    filters:
      - field: status
        operator: '='
        value: "'completed'"
```
</VersionBlock>       

1. Click **Save** and then **Compile** the code.
2. Commit and merge the code changes that contain the metric definitions.
3. If you'd like to further design and define your own metrics, review the following documentation:

    - [dbt metrics](/docs/build/metrics) will provide you in-depth detail on attributes, properties, filters, and how to define and query metrics.
   
    - Review [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) blog to understand best practices for designing and structuring metrics in your dbt project.

## Develop and query metrics

You can dynamically develop and query metrics directly in dbt and verify their accuracy _before_ running a job in the deployment environment by using the `metrics.calculate` and `metrics.develop` macros.

To understand when and how to use the macros above, review [dbt metrics](/docs/build/metrics) and make sure you install the [dbt_metrics package](https://github.com/dbt-labs/dbt_metrics) first before using the above macros.

:::info 📌 

**Note:** You will need access to dbt Cloud and the dbt Semantic Layer from your integrated partner tool of choice. 

:::

## Run your production job

Once you’ve defined metrics in your dbt project, you can perform a job run in your deployment environment to materialize your metrics. The deployment environment is only supported for the dbt Semantic Layer at this moment. 

1. Go to **Deploy** in the navigation and select **Jobs** to re-run the job with the most recent code in the deployment environment.
2. Your metric should appear as a red node in the dbt Cloud IDE and dbt directed acyclic graphs (DAG).

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/metrics_red_nodes.png" title="DAG with metrics appearing as a red node" />


**What’s happening internally?**

- Merging the code into your main branch allows dbt Cloud to pull those changes and builds the definition in the manifest produced by the run.
- Re-running the job in the deployment environment helps materialize the models, which the metrics depend on, in the data platform. It also makes sure that the manifest is up to date.
- Your dbt Discovery API pulls in the most recent manifest and allows your integration information to extract metadata from it.

## Set up dbt Semantic Layer
    
<Snippet path="sl-set-up-steps" />

      
## Troubleshooting

If you're encountering some issues when defining your metrics or setting up the dbt Semantic Layer, check out a list of answers to some of the questions or problems you may be experiencing.
    
<details>
  <summary>How are you storing my data?</summary>
  <div>
    <div>The dbt Semantic Layer does not store, or cache, or log your data. On each query to the Semantic Layer, the resulting data passes through dbt Cloud servers where it is never stored, cached, or logged. The data from your data platform gets routed through dbt Cloud servers, to your connecting data tool.</div>
  </div>
</details>
<details>
    <summary>Is the dbt Semantic Layer open source?</summary>
  <div>
    <div>Some components of the dbt Semantic Layer are open source like dbt-core, the dbt_metrics package, and the BSL-licensed dbt-server. The dbt Proxy Server (what is actually compiling the dbt code) and the Discovery API are not open sources. <br></br><br></br>

During Public Preview, the dbt Semantic Layer is open to all dbt Cloud tiers (Developer, Team, and Enterprise).<br></br><br></br>
<ul>    
<li>dbt Core users can define metrics in their dbt Core projects and calculate them using macros from the metrics package. To use the dbt Semantic Layer integrations, you will need to have a dbt Cloud account.</li><br></br><br></br>
<li>Developer accounts will be able to query the Proxy Server using SQL, but will not be able to browse pre-populated dbt metrics in external tools, which requires access to the Discovery API.</li><br></br><br></br>
<li>Team and Enterprise accounts will be able to set up the Semantic Layer and Discovery API in the integrated partner tool to import metric definitions.</li>
    </ul>
    </div>
    </div>
</details>
<details>
    <summary>The <code>dbt_metrics_calendar_table</code> does not exist or is not authorized?</summary>
  <div>
    <div>All metrics queries are dependent on either the <code>dbt_metrics_calendar_table</code> or a custom calendar set in the users <code>dbt_project.yml</code>. If you have not created this model in the database, these queries will fail and you'll most likely see the following error message:

<code>Object DATABASE.SCHEMA.DBT_METRICS_DEFAULT_CALENDAR does not exist or not authorized.</code><br></br>

<b>Fix:</b>
    
<ul>      
    <li>If developing locally, run <code>dbt run --select dbt_metrics_default_calendar</code></li><br></br>
    <li> If you are using this in production, make sure that you perform a full <code>dbt build</code> or <code>dbt run</code>. If you are running specific <code>selects</code> in your production job, then you will not create this required model.</li>
    </ul>
    </div>
  </div>
</details>
<details>
  <summary>Ephemeral Models - Object does not exist or is not authorized</summary>
  <div>
    <div>Metrics cannot be defined on <a href="https://docs.getdbt.com/docs/build/materializations#ephemeral">ephemeral models</a> because we reference the underlying table in the query that generates the metric so we need the table/view to exist in the database. If your table/view does not exist in your database, you might see this error message:

 <code>Object 'DATABASE.SCHEMA.METRIC_MODEL_TABLE' does not exist or not authorized.</code><br></br>

<b>Fix:</b>
    <ul>
<li>You will need to materialize the model that the metric is built on as a table/view/incremental.</li>
    </ul>
</div>
  </div>
</details>
        
<details>
  <summary>Mismatched Versions - metric type is ‘’</summary>
  <div>
    <div>If you’re running <code>dbt_metrics </code> ≥v0.3.2 but have <code>dbt-core</code> version ≥1.3.0, you’ll likely see these error messages:

<ul>
<li>Error message 1: <code>The metric NAME also references ... but its type is ''. Only metrics of type expression can reference other metrics.</code></li>
<li>Error message 2: <code>Unknown aggregation style:   > in macro default__gen_primary_metric_aggregate (macros/sql_gen/gen_primary_metric_aggregate.sql)</code></li>
    </ul>
The reason you're experiencing this error is because we changed the <code>type</code> property of the metric spec in dbt-core v1.3.0. The new name is <code>calculation_method</code> and the package reflects that new name, so it isn’t finding any <code>type</code> when we try and run outdated code on it.<br></br>

<b>Fix:</b>

<ul>
    <li>Upgrade your <a href="https://hub.getdbt.com/dbt-labs/metrics/latest/">dbt_metrics</a> package to v1.3.0</li>
    </ul>

</div>
  </div>
</details>        
      <br></br>   

   
## Next steps

Are you ready to define your own metrics and bring consistency to data consumers? Review the following documents to understand how to structure, define, and query metrics, and set up the dbt Semantic Layer: 

- [How to design and structure dbt metrics: Recommendations for getting started](https://docs.getdbt.com/blog/how-to-design-and-structure-metrics) to understand best practices for designing and structuring metrics in your dbt project
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [Understanding the components of the dbt Semantic Layer](https://docs.getdbt.com/blog/understanding-the-components-of-the-dbt-semantic-layer) blog post to see further examples
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations. 

</VersionBlock>
