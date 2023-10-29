package main

import (
	"fmt"
	"myauthapp/handlers"
	myMiddleware "myauthapp/middleware"
	"myauthapp/models"
	"myauthapp/utils"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/spf13/viper"
)

func main() {
	utils.LoadConfig()

	host := viper.GetString("database.host") // <- 여기를 추가
	user := viper.GetString("database.user")
	password := viper.GetString("database.password")
	dbName := viper.GetString("database.name")
	port := viper.GetString("server.port")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", user, password, host, dbName) // <- 여기를 수정
	models.InitDB(dsn)

	e := echo.New()

	// CORS 미들웨어 활성화
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	e.POST("/auth/signup", handlers.Signup)
	e.POST("/auth/login", handlers.Login)
	e.GET("/auth/profile", handlers.Profile, myMiddleware.JWTAuthentication)
	e.GET("/simple", handlers.SimpleGet)
	e.POST("/add-product", handlers.AddProduct)

	e.Start(":" + port)
}
