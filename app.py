from flask import Flask, request, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# load products
def load_products():
    try:
        with open("products.json", "r") as f:
            return json.load(f)
    except:
        return []

# save products
def save_products(data):
    with open("products.json", "w") as f:
        json.dump(data, f)

# GET products
@app.route('/products', methods=['GET'])
def get_products():
    return jsonify(load_products())

# ADD PRODUCT (FIXED)
@app.route('/add-product', methods=['POST'])
def add_product():
    try:
        data = request.get_json()

        name = data.get('name')
        price = int(data.get('price'))
        stock = int(data.get('stock'))

        products = load_products()

        new_product = {
            "id": len(products) + 1,
            "name": name,
            "price": price,
            "stock": stock
        }

        products.append(new_product)
        save_products(products)

        return jsonify({"message": "Product added"})

    except Exception as e:
        print("ERROR:", e)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()