import { MarkdownMap } from "../Markdown";

export const markdown: MarkdownMap = new Map([
  [
    "test name",
    {
      markdown: {
        Summary: {
          raw: `# combined-bert

- **Start**: 2019-11-15 13:35:52
- **Git Commit**: e884f0c8d289c93f8f24ed7bd844895c28beb236
- **Model**: bert
- **Train Dataset**
    - *Size*: 43261
    - *Path*: data/lrec-and-leipzig/lrec-and-leipzig-train.tsv
- **Validation Datasets**:
    - **Leipzig**
        - *Size*: 1262
        - *Path*: data/leipzig-combined/leipzig-combined-validation.tsv
    - **LREC**
        - *Size*: 1326
        - *Path*: data/lrec-corpus-final/lrec-corpus-final-validation.tsv
    - **Combined**
        - *Size*: 2588
        - *Path*: data/lrec-and-leipzig/lrec-and-leipzig-validation.tsv

## Command

\`\`\`sh
python train.py --name combined-bert --train-text data/lrec-and-leipzig/lrec-and-leipzig-train.tsv --validation-text Leipzig=data/leipzig-combined/leipzig-combined-validation.tsv LREC=data/lrec-corpus-final/lrec-corpus-final-validation.tsv Combined=data/lrec-and-leipzig/lrec-and-leipzig-validation.tsv -b 2 -m bert -O1 -c log/combined-bert/checkpoints/0024/
\`\`\`

## Restore Working Tree

The working tree at the time of the experiment can be restored with:

\`\`\`sh
git checkout e884f0c8d289c93f8f24ed7bd844895c28beb236
\`\`\`

## Options

\`\`\`
train_text = data/lrec-and-leipzig/lrec-and-leipzig-train.tsv
validation_text = ['Leipzig=data/leipzig-combined/leipzig-combined-validation.tsv', 'LREC=data/lrec-corpus-final/lrec-corpus-final-validation.tsv', 'Combined=data/lrec-and-leipzig/lrec-and-leipzig-validation.tsv']
pre_trained = None
num_epochs = 100
batch_size = 2
num_workers = 16
num_gpus = 1
lr = 5e-05
reset_lr = False
lr_warmup = 0
adam_eps = 1e-08
weight_decay = 0.0
checkpoint = log/combined-bert/checkpoints/0024/
no_cuda = False
name = combined-bert
seed = 1234
model_kind = bert
opt_level = 1
vocab = None
\`\`\``
        },
        "a table": {
          raw: `| Name     | Loss    | Perplexity |
|----------|---------|------------|
| Train    | 1.76877 | 5.86366    |
| Leipzig  | 1.90184 | 6.69819    |
| LREC     | 1.93696 | 6.93762    |
| Combined | 1.90828 | 6.74151    |`
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      markdown: {
        Links: {
          raw: `# With some Links

Code is available on [GitHub](https://github.com) at [jungomi/lavd][github-lavd]

[github-lavd]: https://github.com/jungomi/lavd`
        }
      }
    }
  ]
]);
