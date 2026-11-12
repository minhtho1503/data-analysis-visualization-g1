window.G1.projects.push({
  id: "text",
  type: "Text",
  title: "Student Feedback Classification",
  summary:
    "Classifying Vietnamese student feedback by sentiment (negative, neutral, positive) and by topic (lecturer, program, facility, others).",
  problem: [
    "**Sentiment analysis**: supervised text classification of Vietnamese student feedback.",
    "**Two tasks on two label columns**: `sentiment` (negative, neutral, positive) and `topic` (lecturer, program, facility, others), each with its own model.",
    "**Context**: every semester the university receives thousands of free-text comments, too many to read and sort by hand.",
    "**Models**: Naive Bayes, Logistic Regression and LinearSVC from scikit-learn are compared on TF-IDF features; the best classifier is then tested with Vietnamese sentence embeddings.",
    "**Evaluation**: models are selected by macro-F1 on the validation set and evaluated once on the test set.",
  ],
  dataset: {
    name: "UIT-VSFC (Vietnamese Students' Feedback Corpus)",
    url: "https://huggingface.co/datasets/uitnlp/vietnamese_students_feedback",
    samples: "16,175 sentences: train 11,426 / validation 1,583 / test 3,166 (the authors' split)",
    features: "sentence (feedback text), sentiment (3 classes), topic (4 classes)",
    description:
      "Feedback from end-of-semester surveys at the University of Information Technology, VNU-HCM (academic years 2014-2015 to 2016-2017), labelled by hand (Nguyen et al., KSE 2018). The labels are highly imbalanced: neutral is only 4% and lecturer 71.5% of the training set.",
  },
  workflow: [
    { title: "Load and describe the data", detail: "Download the three splits from Hugging Face, describe the columns and the authors' labelling rules." },
    { title: "Data quality checks", detail: "Missing values, Unicode form, duplicates, unusual lengths, special tokens and abbreviations (our own abbreviation dictionary)." },
    { title: "Exploratory analysis", detail: "Label balance, negative feedback per topic, sentence length and class-specific words, compared with the original paper." },
    { title: "Preprocessing", detail: "Text cleaning, abbreviation expansion, Vietnamese word segmentation with pyvi, label encoding and TF-IDF." },
    { title: "Modelling", detail: "Compare Naive Bayes, Logistic Regression and LinearSVC on TF-IDF, then replace TF-IDF with Vietnamese embeddings for LinearSVC." },
    { title: "Evaluation and error analysis", detail: "Test-set results, confusion matrices, per-class comparison with the paper, class-specific words and error analysis." },
  ],
  owners: ["Nguyễn Thị Thu An"],
  status: "done",
  links: { notebook: "projects/text/text.ipynb", report: "projects/text/text-report.pdf", slides: "projects/text/slides.html", video: null },
  results: [
    {
      title: "Task 1: `sentiment`",
      rows: [
        { model: "Naive Bayes", features: "TF-IDF", acc: "0.8699", f1: "0.5955" },
        { model: "Logistic Regression", features: "TF-IDF", acc: "0.8692", f1: "0.7201" },
        { model: "LinearSVC", features: "TF-IDF", acc: "0.8961", f1: "0.7388" },
        { model: "LinearSVC", features: "Vietnamese embedding", acc: "0.9169", f1: "0.8011", best: true },
      ],
    },
    {
      title: "Task 2: `topic`",
      rows: [
        { model: "Naive Bayes", features: "TF-IDF", acc: "0.8184", f1: "0.5440" },
        { model: "Logistic Regression", features: "TF-IDF", acc: "0.8143", f1: "0.7283" },
        { model: "LinearSVC", features: "TF-IDF", acc: "0.8547", f1: "0.7516" },
        { model: "LinearSVC", features: "Vietnamese embedding", acc: "0.8500", f1: "0.7522", best: true },
      ],
    },
  ],
  questions: [
    { q: "How much negative feedback does each topic get?", a: "facility has the highest negative rate (95.4%, 474 sentences); lecturer has the lowest rate (35.6%) but the most negative sentences (2,909, 54.6% of all negatives)." },
    { q: "Which classifier is best on TF-IDF?", a: "LinearSVC for both tasks (validation macro-F1 0.773 and 0.748), then Logistic Regression, with Naive Bayes last." },
    { q: "Are Vietnamese embeddings better than TF-IDF?", a: "Yes for sentiment: test macro-F1 0.8011 vs 0.7388 (+6.2 points). For topic they are practically equal (0.7522 vs 0.7516)." },
    { q: "Which words does the model rely on?", a: "In LinearSVC on TF-IDF: positive relies on nhiệt_tình, tốt; negative on chưa, cần, nên. Removing the 60 strongest n-grams lowers macro-F1 from 0.7388 to 0.6544." },
    { q: "Where does the model fail?", a: "8.3% of test sentences are wrong and 61.2% of the errors involve neutral; sentences with a contrast word (nhưng, tuy) are wrong 18.4% of the time vs 7.8%; topic others is wrong 30.2% of the time." },
  ],
});
