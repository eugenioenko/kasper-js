/// <reference types="vitest" />
// @vitest-environment node

import { bench } from "vitest";
import { Scanner } from "@src/scanner";

const source = "let x = 42; // ...repeat or generate a large source string...";

bench(
  "class Scanner",
  () => {
    const scanner = new Scanner();
    scanner.scan(source);
  },
  { iterations: 100 }
);

/**
 *  ✓  chromium  bench/scanner.bench.ts 1515ms
     name                     hz     min     max    mean     p75     p99    p995    p999     rme  samples
   · class Scanner  1,046,216.00  0.0000  0.5000  0.0010  0.0000  0.0000  0.1000  0.1000  ±2.77%   523108
   · func Scanner     631,923.62  0.0000  3.9000  0.0016  0.0000  0.1000  0.1000  0.1000  ±3.15%   316025
 */
