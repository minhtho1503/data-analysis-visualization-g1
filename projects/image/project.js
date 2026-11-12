window.G1.projects.push({
  id: "image",
  type: "Image",
  title: "Vietnamese Food Recognition",
  summary:
    "Recognising 30 Vietnamese dishes from photos with a pretrained ResNet50, used as a frozen feature extractor and with a light fine-tune, against a hand-crafted OpenCV baseline.",
  problem: [
    "**Image classification**: supervised classification of food photos into **30 classes**, one dish per photo.",
    "**Use case**: a food or travel app where the user takes a photo and the app names the dish, or shows a short list of suggestions.",
    "**Data quality first**: corrupt files, small images and duplicate photos (found with perceptual hashing) are checked before any model is trained.",
    "**Models**: a pretrained ResNet50 used two ways, as a frozen feature extractor and with a light fine-tune of its last block, plus a hand-crafted OpenCV baseline (colour histogram + SIFT bag of visual words). All three share the same linear softmax head, so only the features differ.",
    "**Evaluation**: models are selected by macro-F1 on the validation set and evaluated once on the test set; top-3 and top-5 accuracy are also reported.",
  ],
  dataset: {
    name: "30VNFoods",
    url: "https://huggingface.co/datasets/vuongnhathien/30VNFoods",
    samples: "25,136 photos: train 17,581 / val 2,515 / test 5,040 (the authors' split)",
    features: "JPEG photo, label = dish name (30 classes), stored as one folder per dish (YOLO classification layout)",
    description:
      "Photos of 30 popular Vietnamese dishes collected from the Internet (Do et al., COMNETSAT 2021), licence CC BY-NC-SA 4.0. The largest dish has 3.5 times more training photos than the smallest. 403 duplicate pairs were found, 65 of them with conflicting labels and 186 linking train to validation or test.",
  },
  workflow: [
    { title: "Load and describe the data", detail: "Download the three splits from Hugging Face into the YOLO classification layout (train/val/test, one folder per dish) and write a labels.csv." },
    { title: "Data quality checks", detail: "Corrupt files, real file format, colour mode, image size and duplicate photos (perceptual hash, all 316 million pairs)." },
    { title: "Exploratory analysis", detail: "Photos per dish, sample photos of every dish, and whether colour statistics alone can separate the dishes." },
    { title: "Preprocessing and augmentation", detail: "Remove small and duplicate photos from train only, resize and normalise; random crop, flip and light colour jitter on train only." },
    { title: "Modelling", detail: "Pretrained ResNet50 as a frozen feature extractor, then a light fine-tune of its last block; an OpenCV colour histogram + SIFT baseline with the same head." },
    { title: "Evaluation and error analysis", detail: "Test results, per-dish F1, confusion matrix, most confused dishes, error rates by confidence, and a look at the most confident errors, which are mostly labelling mistakes." },
  ],
  owners: ["Phan Thị Minh Thơ", "Nguyễn Thị Thu An"],
  status: "done",
  links: { notebook: "projects/image/image.ipynb", report: "projects/image/image-report.pdf", slides: "projects/image/slides.html", video: null },
  results: [
    {
      title: "Test set: 5,040 photos, 30 dishes (same Logistic Regression / softmax head for all three)",
      rows: [
        { model: "Hand-crafted baseline", features: "Colour histogram + SIFT (OpenCV)", acc: "0.2522", f1: "0.2400" },
        { model: "ResNet50 feature extractor", features: "ResNet50 (frozen)", acc: "0.6952", f1: "0.6945" },
        { model: "ResNet50 light fine-tune", features: "ResNet50 (layer4 retrained)", acc: "0.8363", f1: "0.8397", best: true },
      ],
    },
  ],
  questions: [
    { q: "How clean is the dataset?", a: "No corrupt files and only 9 photos under 128 px, but 403 duplicate pairs: 65 with conflicting labels and 186 linking train to validation or test. Cleaning removed 366 training photos." },
    { q: "Are pretrained features better than hand-crafted ones?", a: "By far: with the same classifier head, macro-F1 rises from 0.2400 (colour histogram + SIFT) to 0.6945 (frozen ResNet50)." },
    { q: "Feature extractor or light fine-tune?", a: "Fine-tuning only the last ResNet50 block adds 14.5 points of macro-F1 (0.6945 to 0.8397) and lifts top-3 accuracy from 87.6% to 94.7%." },
    { q: "Which dishes are confused?", a: "Dishes of the same family: bánh bèo as bánh đúc (12.4%), bún riêu as bún bò Huế (10.4%), and bánh canh and hủ tiếu in both directions." },
    { q: "Where does the model fail?", a: "Photos with confidence below 0.5 are wrong 61.5% of the time vs 1.9% above 0.95; photos with a copy under another label are wrong 51.4% vs 16.1%. At least 9 of the 16 most confident errors are photos with a wrong label in the dataset." },
  ],
});
