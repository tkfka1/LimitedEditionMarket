// handlers/product.go

package handlers

import (
	"fmt"
	"myauthapp/models"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func AddProduct(c echo.Context) error {
	product := &models.Product{}

	if err := c.Bind(product); err != nil {
		fmt.Printf("Error binding product: %v\n", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid product data.")
	}

	// fmt.Printf("Received ExpectedPurchase value: %v\n", product.ExpectedPurchase)

	_, err := models.Db.Exec("INSERT INTO products(productName, description, price, image, userId, saleStart, saleEnd, expectedPurchase, popularity) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", product.ProductName, product.Description, product.Price, product.Image, product.UserId, product.SaleStart, product.SaleEnd, product.ExpectedPurchase, product.Popularity)
	if err != nil {

		fmt.Printf("Error inserting product: %v\n", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to add product.")
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Product added!"})
}
func GetProducts(c echo.Context) error {
	products, err := models.GetAllProducts()
	if err != nil {
		fmt.Printf("Error fetching products: %v\n", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to fetch products.")
	}

	return c.JSON(http.StatusOK, products)
}

func DeleteProduct(c echo.Context) error {
	// URL에서 제품 ID를 가져옵니다.
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil {
		fmt.Printf("Error parsing product ID: %v\n", err)
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid product ID.")
	}

	// SQL 명령어를 사용하여 제품을 삭제합니다.
	_, err = models.Db.Exec("DELETE FROM products WHERE id = ?", id)
	if err != nil {
		fmt.Printf("Error deleting product: %v\n", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to delete product.")
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Product deleted!"})
}
