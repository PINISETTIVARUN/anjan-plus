from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# file path
DATA_FILE = "products.json"


# load products
def load_products():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return []


# save products
def save_products(products):
    with open(DATA_FILE, "w") as f:
        json.dump(products, f)


# GET products
@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(load_products())


# ADD product
@app.route('/add_product', methods=['POST'])
def add_product():
    try:
        data = request.get_json()

        name = data.get('name', '')
        price = data.get('price', 0)
        stock = data.get('stock', 0)

        # safe conversion
        try:
            price = int(price)
        except:
            price = 0

        try:
            stock = int(stock)
        except:
            stock = 0

        products = load_products()

        new_product = {
            "id": len(products) + 1,
            "name": name,
            "price": price,
            "stock": stock
        }

        products.append(new_product)
        save_products(products)

        return jsonify({"message": "Product added successfully"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


# run app (local only)
if __name__ == '__main__':
    app.run(debug=True)