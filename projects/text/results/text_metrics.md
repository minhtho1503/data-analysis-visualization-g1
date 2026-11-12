# Text (UIT-VSFC): kết quả trên tập test

Sinh ra bởi `text.ipynb`. Tập test: 3,166 câu. `final = True` là mô hình chọn theo macro-F1 validation.

## Các mô hình

| task      | model      | features   | final   |   test_acc |   test_macro_f1 |   test_weighted_f1 |
|:----------|:-----------|:-----------|:--------|-----------:|----------------:|-------------------:|
| sentiment | NaiveBayes | tfidf_seg  | False   |     0.8699 |          0.5955 |             0.8466 |
| sentiment | LogReg     | tfidf_seg  | False   |     0.8692 |          0.7201 |             0.8748 |
| sentiment | LinearSVC  | tfidf_seg  | False   |     0.8961 |          0.7388 |             0.8917 |
| topic     | NaiveBayes | tfidf_seg  | False   |     0.8184 |          0.544  |             0.7809 |
| topic     | LogReg     | tfidf_seg  | False   |     0.8143 |          0.7283 |             0.8282 |
| topic     | LinearSVC  | tfidf_seg  | False   |     0.8547 |          0.7516 |             0.8562 |
| sentiment | LinearSVC  | emb        | True    |     0.9169 |          0.8011 |             0.9172 |
| topic     | LinearSVC  | emb        | True    |     0.85   |          0.7522 |             0.8574 |

## Thí nghiệm

| experiment                     | A                   | B                                    | metric        |
|:-------------------------------|:--------------------|:-------------------------------------|:--------------|
| tfidf_vs_embedding (sentiment) | TF-IDF 0.7388       | Embedding 0.8011                     | test_macro_f1 |
| tfidf_vs_embedding (topic)     | TF-IDF 0.7516       | Embedding 0.7522                     | test_macro_f1 |
| ngram_ablation (LinearSVC)     | erase top-60 0.6544 | erase 60 random 0.7373 (full 0.7388) | test_macro_f1 |