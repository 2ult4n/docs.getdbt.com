---
title: "Set up the dbt Semantic Layer"
id: setup-dbt-semantic-layer
description: "You can set up the dbt Semantic Layer in dbt Cloud."
sidebar_label: "Set up the dbt Semantic Layer"
---

:::info Coming soon
The dbt Semantic Layer is undergoing some [sophisticated changes](https://www.getdbt.com/blog/dbt-semantic-layer-whats-next/), enabling you to define more complex metrics and query them efficiently.

**What’s changing?** The dbt_metrics package will be [deprecated](https://docs.getdbt.com/blog/deprecating-dbt-metrics) and replaced with [MetricFlow](/docs/build/metricflow-core-concepts), a new way to define metrics in dbt.

**What's new?**  Learn how to [Build your metrics](/docs/build/build-metrics-intro) using MetricFlow, which is one of four key components that makes up the revamped dbt Semantic Layer. It handles SQL query construction and defines the specification for dbt semantic models and metrics.
:::

With the dbt Semantic Layer, you'll be able to centrally define business metrics, reduce code duplication and inconsistency, create self-service in downstream tools, and more. Configure the dbt Semantic Layer in dbt Cloud to connect with your integrated partner tool. 

## Prerequisites

Before you set up the dbt Semantic Layer, make sure you meet the following:

<Snippet src="sl-prerequisites" />


<Snippet src="sl-considerations-banner" />


## Set up dbt Semantic Layer

<Snippet src="sl-set-up-steps" />

<Lightbox src="/img/docs/dbt-cloud/semantic-layer/configure_sl.png" title="Set up dbt Semantic Layer in dbt Cloud" /><br />

 
## Related docs

- [Integrated partner tools](https://www.getdbt.com/product/semantic-layer-integrations) for info on the different integration partners and their documentation
- [Product architecture](/docs/use-dbt-semantic-layer/dbt-semantic-layer#product-architecture) page for more information on plan availability
- [dbt metrics](/docs/build/metrics) for in-depth detail on attributes, properties, filters, and how to define and query metrics
- [dbt Server repo](https://github.com/dbt-labs/dbt-server), which is a persisted HTTP server that wraps dbt core to handle RESTful API requests for dbt operations
