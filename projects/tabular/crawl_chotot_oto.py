"""Thu thập tin rao bán ô tô trên Chợ Tốt ở TP.HCM và Hà Nội qua API công khai, khoảng 1 request mỗi giây.

Cách dùng: python crawl_chotot_oto.py <thư_mục> [--recrawl]

1. Lấy toàn bộ tin của từng thành phố (50 tin mỗi trang) và ghi vào raw_ads.jsonl. Nếu file đã có, script dùng lại
   file đó, trừ khi có --recrawl.
2. Các trường kiểu dáng, số ghế, xuất xứ, màu, hộp số... được API trả về dạng mã số. Với mỗi mã chưa biết, script gọi
   API chi tiết của một tin có mã đó để lấy nhãn chữ, lưu vào labels.json.
3. Ghi chotot_oto.csv đã bỏ thông tin cá nhân: tên, ID tài khoản, ảnh, mô tả, địa chỉ, tọa độ, biển số. Số điện thoại
   và biển số xuất hiện trong tiêu đề được che.

raw_ads.jsonl chứa thông tin cá nhân của người bán, chỉ lưu ở máy và không đưa lên repo.
"""
import csv
import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timedelta, timezone

BASE = "https://gateway.chotot.com"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"
CATEGORY = 2010
REGIONS = {13000: "TP.HCM", 12000: "Hà Nội"}
PAGE, MAX_PER_QUERY = 50, 10000
CODED = ["cartype", "carseats", "carorigin", "carcolor", "gearbox", "fuel", "condition_ad",
         "number_of_owners", "valid_registration", "include_accessories"]
VN = timezone(timedelta(hours=7))
PHONE = re.compile(r"(?<![\d.,])(?:\+?84\s?|0)[35789](?:[\s.\-]?\d){8}(?![\d.,])")
PLATE = re.compile(r"(?<![\w-])\d{2}[A-Z]{1,2}\d?-\d{3}\.?\d{2}(?![\w-])", re.I)


def get(url, tries=4):
    for k in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=30) as r:
                data = json.load(r)
            time.sleep(1.0)
            return data
        except Exception as e:
            print(f"  lỗi {e}, thử lại", flush=True)
            time.sleep(5 * (k + 1))
    return None


def log(msg):
    print(datetime.now().strftime("%H:%M:%S"), msg, flush=True)


def crawl(raw_path):
    seen = set()
    with open(raw_path, "w", encoding="utf-8") as out:
        for region, city in REGIONS.items():
            total = get(f"{BASE}/v1/public/ad-listing?cg={CATEGORY}&region_v2={region}&limit=1&o=0")["total"]
            if total > MAX_PER_QUERY:
                log(f"{city}: {total} tin, vượt giới hạn {MAX_PER_QUERY} của một truy vấn; chỉ lấy được {MAX_PER_QUERY}")
            for offset in range(0, min(total, MAX_PER_QUERY), PAGE):
                page = get(f"{BASE}/v1/public/ad-listing?cg={CATEGORY}&region_v2={region}&limit={PAGE}&o={offset}")
                if not page or not page.get("ads"):
                    break
                for ad in page["ads"]:
                    if ad["list_id"] not in seen:
                        seen.add(ad["list_id"])
                        ad["_crawled_at"] = int(time.time())
                        out.write(json.dumps(ad, ensure_ascii=False) + "\n")
            log(f"{city}: {total} tin, đã có {len(seen)} tin")


def fetch_labels(ads, labels_path):
    labels = json.load(open(labels_path, encoding="utf-8")) if os.path.exists(labels_path) else {}
    todo = {}
    for ad in ads:
        for field in CODED:
            code = ad.get(field)
            if code is not None and str(code) not in labels.get(field, {}):
                todo.setdefault((field, str(code)), ad)
    log(f"Cần tra nhãn cho {len(todo)} mã")
    done = set()
    for (field, code), ad in todo.items():
        if code in labels.get(field, {}) or ad["list_id"] in done:
            continue
        detail = get(f"{BASE}/v2/public/ad-listing/{ad['list_id']}")
        done.add(ad["list_id"])
        params = {p["id"]: p["value"] for p in (detail or {}).get("parameters", []) if p.get("value")}
        for f in CODED:
            if f in params and ad.get(f) is not None:
                labels.setdefault(f, {})[str(ad[f])] = params[f]
    json.dump(labels, open(labels_path, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return labels


def to_time(ms):
    return datetime.fromtimestamp(ms / 1000, VN).strftime("%Y-%m-%d %H:%M:%S") if ms else ""


def write_csv(ads, labels, csv_path):
    def label(ad, field):
        code = ad.get(field)
        return "" if code is None else labels.get(field, {}).get(str(code), f"mã {code}")

    rows = []
    for ad in ads:
        seller = ad.get("seller_info") or {}
        rows.append({
            "list_id": ad["list_id"],
            "city": REGIONS[ad["region_v2"]],
            "district": ad.get("area_name"),
            "posted_at": to_time(ad.get("list_time")),
            "orig_posted_at": to_time(ad.get("orig_list_time")),
            "subject": PLATE.sub("[BIỂN SỐ]", PHONE.sub("[SĐT]", ad.get("subject", ""))),
            "brand": ad.get("carbrand_name"),
            "model": ad.get("carmodel_name"),
            "mfg_year": ad.get("mfdate"),
            "body_type": label(ad, "cartype"),
            "seats": label(ad, "carseats"),
            "gearbox": label(ad, "gearbox"),
            "fuel": label(ad, "fuel"),
            "origin": label(ad, "carorigin"),
            "color": label(ad, "carcolor"),
            "condition": label(ad, "condition_ad"),
            "mileage_km": ad.get("mileage_v2"),
            "owners": label(ad, "number_of_owners"),
            "has_registration": label(ad, "valid_registration"),
            "has_accessories": label(ad, "include_accessories"),
            "price_vnd": ad.get("price"),
            "is_price_not_valid": ad.get("is_price_not_valid"),
            "seller_is_shop": bool(ad.get("company_ad")),
            "seller_live_ads": seller.get("live_ads"),
            "seller_sold_ads": ad.get("sold_ads"),
            "seller_avg_rating": ad.get("average_rating"),
            "seller_total_rating": ad.get("total_rating"),
            "number_of_images": ad.get("number_of_images"),
            "has_video": ad.get("contain_videos") == 1,
            "crawled_at": datetime.fromtimestamp(ad["_crawled_at"], VN).strftime("%Y-%m-%d %H:%M:%S"),
        })
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)
    log(f"Ghi {len(rows)} dòng vào {csv_path}")


def main():
    out_dir = sys.argv[1]
    os.makedirs(out_dir, exist_ok=True)
    raw_path = os.path.join(out_dir, "raw_ads.jsonl")
    if "--recrawl" in sys.argv or not os.path.exists(raw_path):
        crawl(raw_path)
    ads = [json.loads(line) for line in open(raw_path, encoding="utf-8")]
    labels = fetch_labels(ads, os.path.join(out_dir, "labels.json"))
    write_csv(ads, labels, os.path.join(out_dir, "chotot_oto.csv"))


if __name__ == "__main__":
    main()
