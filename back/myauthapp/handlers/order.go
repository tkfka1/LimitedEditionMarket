package handlers

import (
	"myauthapp/models"
	"net/http"

	"github.com/labstack/echo/v4"
)

func AddOrder(c echo.Context) error {
	var order models.Order
	if err := c.Bind(&order); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	result, err := models.AddOrder(order)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	insertID, _ := result.LastInsertId()
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "Order added successfully",
		"id":      insertID,
	})
}
