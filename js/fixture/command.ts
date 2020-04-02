import { DataMap } from "../data";

export const commands: DataMap = new Map([
  [
    "test name",
    {
      command: {
        bin: "python",
        arguments: {
          positional: ["train.py"],
          options: {
            name: "combined-bert",
            "train-text": "data/lrec-and-leipzig/lrec-and-leipzig-train.tsv",
            "validation-text": [
              "Leipzig=data/leipzig-combined/leipzig-combined-validation.tsv",
              "LREC=data/lrec-corpus-final/lrec-corpus-final-validation.tsv",
              "Combined=data/lrec-and-leipzig/lrec-and-leipzig-validation.tsv",
            ],
            "batch-size": 2,
            "opt-level": 1,
            checkpoint: "log/combined-bert/checkpoints/0024/",
          },
        },
        parser: {
          options: {
            name: {
              description: "Name of the experiment",
              default: "default-name",
              type: "string",
            },
            "train-text": {
              required: true,
              description: "Path to text file for training",
              type: "string",
            },
            "validation-text": {
              description:
                "List of text files for validation. If no name is specified it uses the name of the text file",
              count: "+",
              type: "string",
            },
            "batch-size": {
              short: "b",
              default: 1,
              description: "Size of data batches",
              type: "int",
            },
            model: {
              short: "m",
              description: "Which kind of model to use",
              type: "string",
              choices: ["bert", "bert-scratch", "gpt2", "gpt2-scratch"],
              default: "bert",
            },
            "opt-level": {
              short: "O",
              description:
                "Optimisation level for mixed precision training. See https://nvidia.github.io/apex/amp.html for details.",
              choices: [0, 1, 2, 3],
              type: "int",
            },
            "learning-rate": {
              short: "l",
              description: "Learning rate to use",
              default: 5e-5,
              type: "float",
            },
            checkpoint: {
              short: "c",
              description:
                "Path to the checkpoint to be loaded to resume training",
              type: "string",
            },
            "no-cuda": {
              description: "Do not use CUDA even if it's available",
              type: "flag",
            },
            weights: {
              description: "Weights for the different categories",
              type: "float",
              count: 3,
            },
            "weights-with-defaults": {
              description: "Weights for the different categories with defaults",
              type: "float",
              count: 3,
              default: [0.8, 0.4, 1.0],
            },
            "weights-with-single-default": {
              description:
                "Weights for the different categories with the same default for all",
              type: "float",
              count: 3,
              default: 1.0,
            },
          },
        },
      },
    },
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      command: {
        bin: "python",
        arguments: {
          positional: ["help.py"],
          options: { verbose: true },
        },
      },
    },
  ],
  [
    "different start",
    {
      command: {
        arguments: {
          positional: ["nothing.py"],
        },
      },
    },
  ],
]);
