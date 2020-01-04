import { LogMap } from "../Logs";

export const logs: LogMap = new Map([
  [
    "test name",
    {
      logs: {
        BERT: {
          lines: [
            {
              timestamp: "2019-11-15 13:35:52.809545",
              tag: "START",
              message: "Initialising"
            },
            {
              timestamp: "2019-11-15 13:38:40.956620",
              tag: "END",
              message: "Initialising - Duration: 00:02:48"
            },
            {
              timestamp: "2019-11-15 13:38:40.986530",
              tag: "STDOUT",
              message: "Resuming from - Epoch 24:"
            },
            {
              timestamp: "2019-11-15 13:38:40.986863",
              tag: "STDOUT",
              message:
                "                        | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987014",
              tag: "STDOUT",
              message:
                "                        |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 13:38:40.987038",
              tag: "STDOUT",
              message:
                "                        | Train    | 1.80710 | 6.09274    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987057",
              tag: "STDOUT",
              message:
                "                        | Leipzig  | 1.86632 | 6.46449    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987074",
              tag: "STDOUT",
              message:
                "                        | LREC     | 1.90828 | 6.74145    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987091",
              tag: "STDOUT",
              message:
                "                        | Combined | 1.90101 | 6.69266    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987133",
              tag: "START",
              message: "[  1/100] Epoch 25"
            },
            {
              timestamp: "2019-11-15 13:38:40.987142",
              tag: "START",
              message: "[  1/100] Epoch 25 - Train"
            },
            {
              timestamp: "2019-11-15 14:24:40.326947",
              tag: "END",
              message: "[  1/100] Epoch 25 - Train - Duration: 00:45:59"
            },
            {
              timestamp: "2019-11-15 14:24:40.326982",
              tag: "START",
              message: "[  1/100] Epoch 25 - Validation: Leipzig"
            },
            {
              timestamp: "2019-11-15 14:25:01.180138",
              tag: "END",
              message:
                "[  1/100] Epoch 25 - Validation: Leipzig - Duration: 00:00:20"
            },
            {
              timestamp: "2019-11-15 14:25:01.180176",
              tag: "START",
              message: "[  1/100] Epoch 25 - Validation: LREC"
            },
            {
              timestamp: "2019-11-15 14:25:23.097543",
              tag: "END",
              message:
                "[  1/100] Epoch 25 - Validation: LREC - Duration: 00:00:21"
            },
            {
              timestamp: "2019-11-15 14:25:23.097580",
              tag: "START",
              message: "[  1/100] Epoch 25 - Validation: Combined"
            },
            {
              timestamp: "2019-11-15 14:26:05.590689",
              tag: "END",
              message:
                "[  1/100] Epoch 25 - Validation: Combined - Duration: 00:00:42"
            },
            {
              timestamp: "2019-11-15 14:26:05.590994",
              tag: "START",
              message: "[  1/100] Epoch 25 - Checkpoint"
            },
            {
              timestamp: "2019-11-15 14:26:05.904647",
              tag: "END",
              message: "[  1/100] Epoch 25 - Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 14:26:05.974595",
              tag: "START",
              message: "[  1/100] Epoch 25 - Tensorboard"
            },
            {
              timestamp: "2019-11-15 14:26:19.078680",
              tag: "END",
              message: "[  1/100] Epoch 25 - Tensorboard - Duration: 00:00:13"
            },
            {
              timestamp: "2019-11-15 14:26:19.092217",
              tag: "START",
              message: "[  1/100] Epoch 25 - Log Best Checkpoint"
            },
            {
              timestamp: "2019-11-15 14:26:19.092945",
              tag: "END",
              message:
                "[  1/100] Epoch 25 - Log Best Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 14:26:19.173399",
              tag: "STDOUT",
              message:
                "[  1/100] Epoch 25: Learning Rate = 0.00004 (time elapsed 00:47:38)"
            },
            {
              timestamp: "2019-11-15 14:26:19.173556",
              tag: "STDOUT",
              message: "                  | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 14:26:19.173596",
              tag: "STDOUT",
              message: "                  |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 14:26:19.173619",
              tag: "STDOUT",
              message: "                  | Train    | 1.76877 | 5.86366    |"
            },
            {
              timestamp: "2019-11-15 14:26:19.173636",
              tag: "STDOUT",
              message: "                  | Leipzig  | 1.90184 | 6.69819    |"
            },
            {
              timestamp: "2019-11-15 14:26:19.173652",
              tag: "STDOUT",
              message: "                  | LREC     | 1.93696 | 6.93762    |"
            },
            {
              timestamp: "2019-11-15 14:26:19.173667",
              tag: "STDOUT",
              message: "                  | Combined | 1.90828 | 6.74151    |"
            },
            {
              timestamp: "2019-11-15 14:26:19.173685",
              tag: "END",
              message: "[  1/100] Epoch 25 - Duration: 00:47:38"
            },
            {
              timestamp: "2019-11-15 14:26:19.173698",
              tag: "START",
              message: "[  2/100] Epoch 26"
            },
            {
              timestamp: "2019-11-15 14:26:19.173704",
              tag: "START",
              message: "[  2/100] Epoch 26 - Train"
            },
            {
              timestamp: "2019-11-15 15:12:22.795644",
              tag: "END",
              message: "[  2/100] Epoch 26 - Train - Duration: 00:46:03"
            },
            {
              timestamp: "2019-11-15 15:12:22.795679",
              tag: "START",
              message: "[  2/100] Epoch 26 - Validation: Leipzig"
            },
            {
              timestamp: "2019-11-15 15:12:43.641946",
              tag: "END",
              message:
                "[  2/100] Epoch 26 - Validation: Leipzig - Duration: 00:00:20"
            },
            {
              timestamp: "2019-11-15 15:12:43.641985",
              tag: "START",
              message: "[  2/100] Epoch 26 - Validation: LREC"
            },
            {
              timestamp: "2019-11-15 15:13:05.543159",
              tag: "END",
              message:
                "[  2/100] Epoch 26 - Validation: LREC - Duration: 00:00:21"
            },
            {
              timestamp: "2019-11-15 15:13:05.543195",
              tag: "START",
              message: "[  2/100] Epoch 26 - Validation: Combined"
            },
            {
              timestamp: "2019-11-15 15:13:48.248826",
              tag: "END",
              message:
                "[  2/100] Epoch 26 - Validation: Combined - Duration: 00:00:42"
            },
            {
              timestamp: "2019-11-15 15:13:48.248880",
              tag: "START",
              message: "[  2/100] Epoch 26 - Checkpoint"
            },
            {
              timestamp: "2019-11-15 15:13:48.546840",
              tag: "END",
              message: "[  2/100] Epoch 26 - Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 15:13:48.615871",
              tag: "START",
              message: "[  2/100] Epoch 26 - Tensorboard"
            },
            {
              timestamp: "2019-11-15 15:14:01.661938",
              tag: "END",
              message: "[  2/100] Epoch 26 - Tensorboard - Duration: 00:00:13"
            },
            {
              timestamp: "2019-11-15 15:14:01.715809",
              tag: "START",
              message: "[  2/100] Epoch 26 - Log Best Checkpoint"
            },
            {
              timestamp: "2019-11-15 15:14:01.716438",
              tag: "END",
              message:
                "[  2/100] Epoch 26 - Log Best Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 15:14:01.796424",
              tag: "STDOUT",
              message:
                "[  2/100] Epoch 26: Learning Rate = 0.00004 (time elapsed 00:47:42)"
            },
            {
              timestamp: "2019-11-15 15:14:01.796606",
              tag: "STDOUT",
              message: "                  | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 15:14:01.796657",
              tag: "STDOUT",
              message: "                  |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 15:14:01.796687",
              tag: "STDOUT",
              message: "                  | Train    | 1.73628 | 5.67619    |"
            },
            {
              timestamp: "2019-11-15 15:14:01.796723",
              tag: "STDOUT",
              message: "                  | Leipzig  | 1.86230 | 6.43855    |"
            },
            {
              timestamp: "2019-11-15 15:14:01.796749",
              tag: "STDOUT",
              message: "                  | LREC     | 1.92115 | 6.82881    |"
            },
            {
              timestamp: "2019-11-15 15:14:01.796775",
              tag: "STDOUT",
              message: "                  | Combined | 1.91138 | 6.76240    |"
            },
            {
              timestamp: "2019-11-15 15:14:01.796803",
              tag: "END",
              message: "[  2/100] Epoch 26 - Duration: 00:47:42"
            },
            {
              timestamp: "2019-11-15 15:14:01.796821",
              tag: "START",
              message: "[  3/100] Epoch 27"
            },
            {
              timestamp: "2019-11-15 15:14:01.796831",
              tag: "START",
              message: "[  3/100] Epoch 27 - Train"
            },
            {
              timestamp: "2019-11-15 16:00:04.985989",
              tag: "END",
              message: "[  3/100] Epoch 27 - Train - Duration: 00:46:03"
            },
            {
              timestamp: "2019-11-15 16:00:04.986023",
              tag: "START",
              message: "[  3/100] Epoch 27 - Validation: Leipzig"
            },
            {
              timestamp: "2019-11-15 16:00:25.845536",
              tag: "END",
              message:
                "[  3/100] Epoch 27 - Validation: Leipzig - Duration: 00:00:20"
            },
            {
              timestamp: "2019-11-15 16:00:25.845573",
              tag: "START",
              message: "[  3/100] Epoch 27 - Validation: LREC"
            },
            {
              timestamp: "2019-11-15 16:00:47.759962",
              tag: "END",
              message:
                "[  3/100] Epoch 27 - Validation: LREC - Duration: 00:00:21"
            },
            {
              timestamp: "2019-11-15 16:00:47.759998",
              tag: "START",
              message: "[  3/100] Epoch 27 - Validation: Combined"
            },
            {
              timestamp: "2019-11-15 16:01:30.311158",
              tag: "END",
              message:
                "[  3/100] Epoch 27 - Validation: Combined - Duration: 00:00:42"
            },
            {
              timestamp: "2019-11-15 16:01:30.311220",
              tag: "START",
              message: "[  3/100] Epoch 27 - Checkpoint"
            },
            {
              timestamp: "2019-11-15 16:01:30.571945",
              tag: "END",
              message: "[  3/100] Epoch 27 - Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 16:01:30.642070",
              tag: "START",
              message: "[  3/100] Epoch 27 - Tensorboard"
            },
            {
              timestamp: "2019-11-15 16:01:44.058234",
              tag: "END",
              message: "[  3/100] Epoch 27 - Tensorboard - Duration: 00:00:13"
            },
            {
              timestamp: "2019-11-15 16:01:44.081777",
              tag: "START",
              message: "[  3/100] Epoch 27 - Log Best Checkpoint"
            },
            {
              timestamp: "2019-11-15 16:01:44.082400",
              tag: "END",
              message:
                "[  3/100] Epoch 27 - Log Best Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 16:01:44.162848",
              tag: "STDOUT",
              message:
                "[  3/100] Epoch 27: Learning Rate = 0.00004 (time elapsed 00:47:42)"
            },
            {
              timestamp: "2019-11-15 16:01:44.163004",
              tag: "STDOUT",
              message: "                  | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 16:01:44.163042",
              tag: "STDOUT",
              message: "                  |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 16:01:44.163063",
              tag: "STDOUT",
              message: "                  | Train    | 1.71218 | 5.54103    |"
            },
            {
              timestamp: "2019-11-15 16:01:44.163080",
              tag: "STDOUT",
              message: "                  | Leipzig  | 1.89063 | 6.62352    |"
            },
            {
              timestamp: "2019-11-15 16:01:44.163096",
              tag: "STDOUT",
              message: "                  | LREC     | 1.93212 | 6.90415    |"
            },
            {
              timestamp: "2019-11-15 16:01:44.163112",
              tag: "STDOUT",
              message: "                  | Combined | 1.91802 | 6.80750    |"
            },
            {
              timestamp: "2019-11-15 16:01:44.163133",
              tag: "END",
              message: "[  3/100] Epoch 27 - Duration: 00:47:42"
            },
            {
              timestamp: "2019-11-15 16:01:44.163147",
              tag: "START",
              message: "[  4/100] Epoch 28"
            },
            {
              timestamp: "2019-11-15 16:01:44.163154",
              tag: "START",
              message: "[  4/100] Epoch 28 - Train"
            },
            {
              timestamp: "2019-11-15 16:47:42.712027",
              tag: "END",
              message: "[  4/100] Epoch 28 - Train - Duration: 00:45:58"
            },
            {
              timestamp: "2019-11-15 16:47:42.712062",
              tag: "START",
              message: "[  4/100] Epoch 28 - Validation: Leipzig"
            },
            {
              timestamp: "2019-11-15 16:48:03.584452",
              tag: "END",
              message:
                "[  4/100] Epoch 28 - Validation: Leipzig - Duration: 00:00:20"
            },
            {
              timestamp: "2019-11-15 16:48:03.584488",
              tag: "START",
              message: "[  4/100] Epoch 28 - Validation: LREC"
            },
            {
              timestamp: "2019-11-15 16:48:25.496696",
              tag: "END",
              message:
                "[  4/100] Epoch 28 - Validation: LREC - Duration: 00:00:21"
            },
            {
              timestamp: "2019-11-15 16:48:25.496733",
              tag: "START",
              message: "[  4/100] Epoch 28 - Validation: Combined"
            },
            {
              timestamp: "2019-11-15 16:49:08.043388",
              tag: "END",
              message:
                "[  4/100] Epoch 28 - Validation: Combined - Duration: 00:00:42"
            },
            {
              timestamp: "2019-11-15 16:49:08.043448",
              tag: "START",
              message: "[  4/100] Epoch 28 - Checkpoint"
            },
            {
              timestamp: "2019-11-15 16:49:08.303998",
              tag: "END",
              message: "[  4/100] Epoch 28 - Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 16:49:08.374069",
              tag: "START",
              message: "[  4/100] Epoch 28 - Tensorboard"
            },
            {
              timestamp: "2019-11-15 16:49:21.420466",
              tag: "END",
              message: "[  4/100] Epoch 28 - Tensorboard - Duration: 00:00:13"
            },
            {
              timestamp: "2019-11-15 16:49:21.468143",
              tag: "START",
              message: "[  4/100] Epoch 28 - Log Best Checkpoint"
            },
            {
              timestamp: "2019-11-15 16:49:21.468800",
              tag: "END",
              message:
                "[  4/100] Epoch 28 - Log Best Checkpoint - Duration: 00:00:00"
            },
            {
              timestamp: "2019-11-15 16:49:21.548745",
              tag: "STDOUT",
              message:
                "[  4/100] Epoch 28: Learning Rate = 0.00004 (time elapsed 00:47:37)"
            },
            {
              timestamp: "2019-11-15 16:49:21.548924",
              tag: "STDOUT",
              message: "                  | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 16:49:21.548978",
              tag: "STDOUT",
              message: "                  |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 16:49:21.549007",
              tag: "STDOUT",
              message: "                  | Train    | 1.69418 | 5.44218    |"
            },
            {
              timestamp: "2019-11-15 16:49:21.549034",
              tag: "STDOUT",
              message: "                  | Leipzig  | 1.86503 | 6.45611    |"
            },
            {
              timestamp: "2019-11-15 16:49:21.549059",
              tag: "STDOUT",
              message: "                  | LREC     | 1.90840 | 6.74232    |"
            },
            {
              timestamp: "2019-11-15 16:49:21.549085",
              tag: "STDOUT",
              message: "                  | Combined | 1.89648 | 6.66238    |"
            }
          ]
        },
        "something short": {
          lines: [
            { message: "hello world" },
            { message: "nothing else to say" }
          ]
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      logs: {
        "BERT trimmed": {
          lines: [
            {
              timestamp: "2019-11-15 13:35:52.809545",
              tag: "START",
              message: "Initialising"
            },
            {
              timestamp: "2019-11-15 13:38:40.956620",
              tag: "END",
              message: "Initialising - Duration: 00:02:48"
            },
            {
              timestamp: "2019-11-15 13:38:40.986530",
              tag: "STDOUT",
              message: "Resuming from - Epoch 24:"
            },
            {
              timestamp: "2019-11-15 13:38:40.986863",
              tag: "STDOUT",
              message:
                "                        | Name     | Loss    | Perplexity |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987014",
              tag: "STDOUT",
              message:
                "                        |----------|---------|------------|"
            },
            {
              timestamp: "2019-11-15 13:38:40.987038",
              tag: "STDOUT",
              message:
                "                        | Train    | 1.80710 | 6.09274    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987057",
              tag: "STDOUT",
              message:
                "                        | Leipzig  | 1.86632 | 6.46449    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987074",
              tag: "STDOUT",
              message:
                "                        | LREC     | 1.90828 | 6.74145    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987091",
              tag: "STDOUT",
              message:
                "                        | Combined | 1.90101 | 6.69266    |"
            },
            {
              timestamp: "2019-11-15 13:38:40.987133",
              tag: "START",
              message: "[  1/100] Epoch 25"
            },
            {
              timestamp: "2019-11-15 13:38:40.987142",
              tag: "START",
              message: "[  1/100] Epoch 25 - Train"
            }
          ]
        },
        "no timestamp": {
          lines: [
            { message: "First something something", tag: "STDOUT" },
            { message: "Second other thing", tag: "STDOUT" },
            { message: "and another thing", tag: "STDOUT" }
          ]
        }
      }
    }
  ],
  [
    "different start",
    {
      logs: {
        "no tag": {
          lines: [
            {
              message: "First something something",
              timestamp: "2019-11-15 13:38:40.987133"
            },
            {
              message: "Second other thing",
              timestamp: "2019-11-15 13:39:20.2222"
            },
            {
              message: "and another thing",
              timestamp: "2019-11-15 13:40:00.000"
            }
          ]
        },
        "selectively omitting the timestamp": {
          lines: [
            {
              message: "No timestamp at the beginning"
            },
            {
              message: "Second other thing",
              timestamp: "2019-11-15 13:39:20.2222"
            },
            {
              message: "Without a timestamp in the middle"
            },
            {
              message: "and another thing",
              timestamp: "2019-11-15 13:40:00.000"
            }
          ]
        }
      }
    }
  ]
]);
