var express = require("express");
var router = express.Router();
const productController = require("../mongo/product.controller");
const multer = require("multer");
// const { ObjectId } = require('mongodb');
const checktoken = require("../helper/checktoken");
const upload = require("../helper/upload");
const path = require("path");
const {insert} = require('../mongo/product.controller')
// them sp mơi
router.post("/",insert);

router.get("/", async (req, res) => {
  try {
    const product = await productController.gettAll();
    return res.status(200).json({ Product: product });
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/new", async (req, res) => {
  try {
    const product = await productController.getNew();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/view", async (req, res) => {
  try {
    const product = await productController.getProView();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

// viết routing cho lấy sp theo key
//http://localhost:3000/product/key/value
router.get("/:key/:value", async (req, res) => {
  try {
    const { key, value } = req.params;
    const pro = await productController.getByKey(key, value);
    return res.status(200).json({ Productkey: pro });
  } catch (error) {
    console.log("lỗi lấy sp theo key", error);
    return res.status(500).json({ mess: error });
  }
});

//routing cập nhật sản phẩm theo id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const proUpdate = await productController.updateById(id, body);
    return res.status(200).json({ ProductUpdate: proUpdate });
  } catch (error) {
  
  }
});

//routing xóa sp theo id

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy đượccái id mà người dùng gửi lên
    const proDel = await productController.remove(id);
    console.log("Xóa sp thành công");
    return res.status(200).json({ ProducDelete: proDel });
  } catch (error) {
    console.log("lỗi xóa sp theo id", error);
    return res.status(500).json({ mess: error });
  }
});

router.get("/new", async (req, res) => {
  try {
    const product = await productController.getNew();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/hot", async (req, res) => {
  try {
    const product = await productController.getHot();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params; // lấy được cái id mà người dùng gửi lên
    const pro = await productController.getById(id);
    // return pro
    return res.status(200).json(pro);
  } catch (error) {
    console.log("lỗi lay chi tiet sp", error);
    return res.status(500).json({ mess: error });
  }
});

router.get("/related/:id/related", async (req, res) => {
  try {
    const { id } = req.params; // Lấy id của sản phẩm từ URL
    console.log("Product ID:", id); // Kiểm tra xem id đã được lấy đúng chưa
    const relatedProducts =
      await productController.getRelatedProductsByProductId(id);
    console.log("Related Products:", relatedProducts); // Kiểm tra kết quả trả về từ controller
    return res.status(200).json(relatedProducts);
  } catch (error) {
    console.log("Lỗi lấy sản phẩm liên quan theo danh mục", error);
    return res.status(500).json({ message: error.message });
  }
});

router.get("/search/name/:name", async (req, res) => {
  try {
    const name = req.params.name; // Lấy tên sản phẩm từ route param
    const pro = await productController.search(name); // Gọi hàm search với tên sản phẩm
    return res.status(200).json(pro);
  } catch (error) {
    console.log("Lỗi tìm kiếm sản phẩm", error);
    return res.status(500).json({ mess: error });
  }
});

router.get("/product/tang/dan", async (req, res) => {
  try {
    const product = await productController.getAscending();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});
router.get("/product/giam/dan", async (req, res) => {
  try {
    const product = await productController.getDecrease();
    return res.status(200).json(product);
  } catch (error) {
    console.log("Load sản phẩm không thành công", error);
    res.status(500).json({ mess: error });
  }
});

module.exports = router;
