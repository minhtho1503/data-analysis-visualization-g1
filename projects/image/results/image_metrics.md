# Image (30VNFoods): kết quả trên tập test

Sinh ra bởi `image.ipynb`. Tập test: 5,040 ảnh. `final = True` là mô hình chọn theo macro-F1 validation.

## Các mô hình

| model                                                       | final   |   test_acc |   test_macro_f1 |   test_top3 |   test_top5 |
|:------------------------------------------------------------|:--------|-----------:|----------------:|------------:|------------:|
| Handcrafted (colour histogram + SIFT) + Logistic Regression | False   |     0.2522 |          0.24   |      0.4544 |      0.5683 |
| ResNet50 frozen + Logistic Regression                       | False   |     0.6952 |          0.6945 |      0.8762 |      0.9306 |
| ResNet50 fine-tune                                          | True    |     0.8363 |          0.8397 |      0.947  |      0.9738 |

## Làm sạch dữ liệu

| split   |   raw |   corrupt |   small |   duplicate |   final |
|:--------|------:|----------:|--------:|------------:|--------:|
| train   | 17581 |         0 |       5 |         361 |   17215 |
| val     |  2515 |         0 |       0 |           0 |    2515 |
| test    |  5040 |         0 |       0 |           0 |    5040 |
| total   | 25136 |         0 |       5 |         361 |   24770 |

## Các cặp món bị nhầm nhiều nhất

| true_dish   | predicted_as   |   share_of_true |   n_images |   reverse_share |
|:------------|:---------------|----------------:|-----------:|----------------:|
| Banh beo    | Banh duc       |          0.124  |         16 |          0.0301 |
| Bun rieu    | Bun bo Hue     |          0.1039 |         24 |          0.0458 |
| Banh canh   | Hu tieu        |          0.1036 |         20 |          0.1015 |
| Hu tieu     | Banh canh      |          0.1015 |         20 |          0.1036 |
| Bun mam     | Canh chua      |          0.0903 |         14 |          0.0242 |