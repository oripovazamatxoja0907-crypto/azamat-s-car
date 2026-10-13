const express = require("express");
const {
  getCatalog,
  getCatalogById,
} = require("../controllers/catalog.controller");

const router = express.Router();

router.get("/", getCatalog);
router.get("/:id", getCatalogById);

module.exports = router;
