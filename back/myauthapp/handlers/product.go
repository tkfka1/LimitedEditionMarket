// handlers/product.go

package handlers

import (
	"fmt"
	"myauthapp/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func AddProduct(c echo.Context) error {
	product := &models.Product{}
	if err := c.Bind(product); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid product data.")
	}

	_, err := models.Db.Exec("INSERT INTO Products(productName, description, price, image) VALUES(?, ?, ?, ?)", product.ProductName, product.Description, product.Price, product.Image)
	if err != nil {
		fmt.Printf("Error inserting product: %v\n", err)
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to add product.")
	}

	return c.JSON(http.StatusOK, map[string]string{"message": "Product added!"})
}
