package handlers

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func SimpleGet(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"message": "This is a simple GET response!"})
}
