# Detecting Cryptocurrency Pump-and-Dump Schemes with AI

Pump-and-dump activity in crypto markets is characterized by sudden, coordinated spikes in price and volume followed by sharp reversals. Detecting these patterns in real time requires more than a single threshold on price change.

This project builds a multi-layer monitoring system that combines statistical signals, unsupervised anomaly detection, and graph-based relationship analysis to surface suspicious market behavior.


## Problem Statement

Crypto markets are noisy. Large price moves occur for legitimate reasons (news, liquidations, broader market moves) as well as for manipulative ones. Simple percentage-change alerts generate excessive false positives. Purely supervised approaches are limited by the scarcity of reliably labeled pump-and-dump events.

A practical detector needs multiple complementary views of the market: statistical extremity, multivariate anomaly scores, and evidence of coordinated behavior across assets.


## Project Overview

CryptoPulse is a real-time cryptocurrency monitoring system that:

- Ingests live and historical market data via the CoinGecko API
- Applies statistical anomaly detection (Z-score on price and volume)
- Runs Isolation Forest for multivariate anomaly scoring
- Builds a market relationship graph with NetworkX to surface correlated or suspicious clusters
- Generates alerts and exposes results through a web dashboard and REST API

The system is designed for continuous monitoring and inspection rather than fully automated trading decisions.


## System Architecture

```
CoinGecko API
      │
      ▼
Data Fetcher (live + historical)
      │
      ▼
Storage / in-memory state
      │
      ├── Statistical layer (Z-score on price & volume)
      │
      ├── ML layer (Isolation Forest)
      │
      └── Graph layer (NetworkX – coin relationship analysis)
      │
      ▼
Alert system
      │
      ▼
Dashboard + REST API
  (/api/live, /api/historical, /api/anomalies, /api/graph, /api/alerts)
```

Each detection layer can fire independently; the dashboard presents them side by side so an analyst can see where signals agree or diverge.


## Technology Stack and Design Decisions

**CoinGecko API** supplies market data without requiring exchange-level API keys for basic monitoring. Rate limits and data granularity constrain what is possible, but the free tier is sufficient for a demonstration system.

**Z-score analysis** provides an interpretable statistical baseline. Extreme deviations in price or volume relative to a recent window are easy to explain and serve as a first filter.

**Isolation Forest** was chosen as the unsupervised ML component because it handles multivariate inputs (price change, volume change, and related features) and does not require labeled pump-and-dump examples. It surfaces points that are structurally different from the recent majority behavior.

**NetworkX** supports the graph layer. Coins are nodes; relationships (correlation, co-movement, or other pairwise signals) are edges. Connected components or unusual clusters can indicate coordinated activity that single-asset detectors miss.

**Flask** serves both the dashboard and the REST API. Keeping the interface and the analysis endpoints in one application simplified development for a single-process prototype.


## Implementation Details

### Data Layer
The data fetcher periodically pulls live market data and can also retrieve historical series for a given coin. Results are stored so that anomaly detection and graph construction can run on consistent snapshots.

### Statistical Detection
For selected metrics (primarily price and volume), rolling means and standard deviations are computed. Z-scores beyond a configured threshold generate statistical alerts. The thresholds are intentionally visible and tunable.

### Machine Learning Detection
Feature vectors are constructed from recent market statistics and passed to an Isolation Forest model. Scores that fall into the anomalous region are recorded as ML-based alerts. The model can be refit periodically on recent data so that the notion of “normal” adapts to changing market regimes.

### Graph Analysis
A market graph is built from pairwise relationships across the watched universe of coins. Graph metrics and cluster structure are used to highlight groups of assets that are moving together in ways that may warrant closer inspection.

### Alerting and Interface
Alerts from all layers are collected with timestamps and basic metadata. The dashboard visualizes live data, historical series, anomaly flags, and graph results. REST endpoints allow programmatic access to the same information.


## Challenges and Trade-offs

Label scarcity is fundamental. Without a large, clean set of confirmed pump-and-dump events, evaluation remains qualitative. The system therefore emphasizes transparency (showing which layer fired and why) over a single opaque “manipulation probability.”

API rate limits and data granularity constrain real-time resolution. CoinGecko is adequate for medium-frequency monitoring but is not a substitute for exchange WebSocket feeds when sub-minute precision is required.

Isolation Forest and Z-score thresholds both require choices (contamination rate, window size, threshold values). These choices affect sensitivity and false-positive rate. The current design exposes the parameters rather than hiding them behind a fixed “optimal” configuration.

Graph construction depends on the definition of “relationship.” Correlation over short windows is noisy; longer windows lag. The project uses a pragmatic definition suitable for demonstration and leaves more sophisticated relationship mining as future work.


## Results

The system successfully surfaces periods of extreme price/volume behavior, multivariate anomalies, and groups of co-moving assets. When multiple layers flag the same coin or cluster, the combined signal is more actionable than any single detector.

False positives remain inevitable in noisy markets. The value of the system lies in reducing the search space for a human analyst rather than in fully autonomous detection.


## Lessons Learned

Layered detection is more robust than a single method. Statistical, ML, and graph signals fail in different ways; agreement across layers is a stronger cue than any individual score.

Interpretability matters in this domain. An alert that cannot be traced to a concrete statistical deviation, anomaly score, or graph pattern is difficult to trust or act on.

Real-time systems are constrained by their data source. Architectural elegance cannot overcome coarse or delayed market data.


## Limitations

CryptoPulse is a research and demonstration system. It does not have access to order-book or trade-level data that would be needed for higher-confidence manipulation detection. There is no formal backtest against a labeled set of historical pump-and-dump events. Alerts are not financial advice and should not be used as the sole basis for trading decisions. The current coin universe and update frequency are limited by the free API tier.


## Future Improvements

- Higher-frequency data sources (exchange WebSockets)
- Richer feature sets (order-book imbalance, social signals where legally available)
- Supervised or semi-supervised components once reliable labels exist
- More sophisticated graph features and temporal graph models
- Alert prioritization and noise reduction based on historical precision


## Conclusion

Detecting market manipulation is less about finding a single perfect model and more about combining complementary, inspectable signals. Statistical extremity, multivariate anomaly detection, and relationship analysis each contribute different evidence.

CryptoPulse implements that layered approach in a form that can be run, inspected, and extended. The result is a monitoring system that narrows attention rather than claiming definitive detection.
