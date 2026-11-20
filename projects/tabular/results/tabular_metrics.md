| model | R² test | Sai số % median | Lệch ≤ 10% | MAE (triệu) |
|---|---|---|---|---|
| Baseline: giá trung bình | -0.0 | 35.96 | 14.227 | 275.656 |
| Baseline: median cùng dòng xe và đời | 0.847 | 7.208 | 60.444 | 74.671 |
| Hồi quy tuyến tính | 0.932 | 7.914 | 58.717 | 72.406 |
| kNN (k=10) | 0.812 | 14.595 | 36.842 | 122.583 |
| Cây quyết định (sâu 12) | 0.917 | 7.999 | 56.908 | 72.615 |
| Random forest (cuối cùng) | 0.953 | 5.545 | 70.312 | 53.904 |
| Gradient boosting | 0.952 | 6.301 | 66.859 | 58.392 |
