/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  AggregationTemporality,
  AggregationTemporalitySelector,
  InstrumentType,
  MetricReader,
} from '../../src';
import { MetricCollector } from '../../src/state/MetricCollector';

/**
 * A test metric reader that implements no-op onForceFlush() and onShutdown() handlers.
 */
export class TestMetricReader extends MetricReader {
  private _aggregationTemporalitySelector: AggregationTemporalitySelector;

  constructor(aggregationTemporalitySelector?: AggregationTemporalitySelector) {
    super();
    this._aggregationTemporalitySelector = aggregationTemporalitySelector ?? (() => AggregationTemporality.CUMULATIVE);
  }

  protected onForceFlush(): Promise<void> {
    return Promise.resolve(undefined);
  }

  protected onShutdown(): Promise<void> {
    return Promise.resolve(undefined);
  }

  selectAggregationTemporality(instrumentType: InstrumentType) {
    return this._aggregationTemporalitySelector(instrumentType);
  }

  getMetricCollector(): MetricCollector {
    return this['_metricProducer'] as MetricCollector;
  }
}
