# G1 — CO5177 Nền tảng lập trình cho phân tích và trực quan dữ liệu

HCMUT · Khoa Khoa học và Kỹ thuật Máy tính · Học kỳ 261 (2026–2027) · GV Lê Thành Sách

Landing page (GitHub Pages): *(link once Pages is enabled)*

## Members

| Họ tên | MSHV | Phụ trách |
|---|---|---|
| Phan Thị Minh Thơ | 2470112 | Tabular & Image |
| Nguyễn Thị Thu An | 2470315 | Text & Image |

## Sub-projects

| Data type | Page | Notebook | Report |
|---|---|---|---|
| Tabular | `projects/tabular/` | `projects/tabular/tabular.ipynb` | `projects/tabular/tabular-report.pdf` |
| Text | `projects/text/` | `projects/text/text.ipynb` | `projects/text/text-report.pdf` |
| Image | `projects/image/` | `projects/image/image.ipynb` | `projects/image/image-report.pdf` |

Group report for LMS: `report/G1-report.pdf`.

## Repo structure

```
index.html                     Landing page
assets/css/style.css           Site styles
assets/js/site.js              Course, team, repo info
assets/js/render.js            Builds every page from site.js + project.js files
report/                        Shared LaTeX: preamble.tex, cover.tex, main.tex (group report)
projects/<type>/               One folder per sub-project, one owner each
  index.html                   Sub-page
  project.js                   Page content and links for this sub-project
  <type>.ipynb                 Notebook (runs with "Run all" on Colab)
  figures/                     PNGs exported by the notebook, used by the report
  report/chapter.tex           Report content (also included in the group report)
  report/report.tex            Builds this sub-project's PDF
  <type>-report.pdf            Submitted PDF
scripts/install_tectonic.sh    Installs Tectonic (XeLaTeX) into .tools/, no sudo
scripts/build_reports.sh       Builds the PDFs: all, one type (`text`), or `group`
```

Keep the file name `chapter.tex`: `report/main.tex` includes every sub-project's chapter by that name.

## Run locally

```bash
uv sync                          # Python venv with all dependencies
python -m http.server 8000       # preview the site at http://localhost:8000
scripts/install_tectonic.sh      # once per machine
scripts/build_reports.sh         # build all PDFs (first run downloads LaTeX packages, ~3 min)
```
