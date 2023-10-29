package middleware

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
)

var jwtKey = []byte("your_secret_key")

func JWTAuthentication(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		tokenString := c.Request().Header.Get("Authorization")
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			return c.String(http.StatusUnauthorized, "Unauthorized")
		}

		return next(c)
	}
}
