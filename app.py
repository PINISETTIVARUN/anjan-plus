from flask import Flask, request, jsonify
from flask_cors import CORS
import json, os
from datetime import date

app = Flask(__name__)
CORS(app)

PRODUCT_FILE = "products.json"
SALES_FILE = "sales.json"

def load(file):
    if not os.path.exists(file):
        return []
    with open(file, "r") as f:
        return json.load(f)

def save(file, data):
    with open(file, "w") as f:
        json.dump(data, f)

@app.route('/products')
def products():
    return jsonify(load(PRODUCT_FILE))

@app.route('/add_product', methods=['POST'])
def add_product():
    data = request.json
    products = load(PRODUCT_FILE)

    product = {
        "id": len(products)+1,
        "name": data['name'],
        "stock": int(data['stock']),
        "price": float(data['price'])
    }

    products.append(product)
    save(PRODUCT_FILE, products)
    return jsonify({"msg":"added"})

@app.route('/sell', methods=['POST'])
def sell():
    data = request.json
    products = load(PRODUCT_FILE)
    sales = load(SALES_FILE)

    for item in data:
        for p in products:
            if p["id"] == item["id"]:
                p["stock"] -= item["qty"]

                sales.append({
                    "name": p["name"],
                    "qty": item["qty"],
                    "total": p["price"]*item["qty"],
                    "date": str(date.today())
                })

    save(PRODUCT_FILE, products)
    save(SALES_FILE, sales)
    return jsonify({"msg":"sold"})

@app.route('/sales')
def get_sales():
    return jsonify(load(SALES_FILE))

if __name__ == "__main__":
    app.run(debug=True)