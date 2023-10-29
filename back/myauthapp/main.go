package main

import (
	"fmt"
	"myauthapp/handlers"
	"myauthapp/models"
	"os"

	_ "myauthapp/docs" // Import the docs (ensure your path is correct)

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title MyAuthApp API
// @version 1.0
// @description This is the API documentation for MyAuthApp.
// @host localhost:8080
// @BasePath /
func main() {
	// utils.LoadConfig()

	// host := viper.GetString("database.host") // <- 여기를 추가
	// user := viper.GetString("database.user")
	// password := viper.GetString("database.password")
	// dbName := viper.GetString("database.name")
	// port := viper.GetString("server.port")

	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbName := os.Getenv("DB_NAME")
	port := os.Getenv("SERVER_PORT")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", user, password, host, dbName) // <- 여기를 수정
	models.InitDB(dsn)

	e := echo.New()
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// CORS 미들웨어 활성화
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{echo.GET, echo.HEAD, echo.PUT, echo.PATCH, echo.POST, echo.DELETE},
	}))

	e.POST("/auth/signup", handlers.Signup)
	e.POST("/auth/login", handlers.Login)
	e.GET("/auth/profile/:id", handlers.Profile)
	e.GET("/simple", handlers.SimpleGet)

	e.POST("/add-product", handlers.AddProduct)
	e.DELETE("/product/:id", handlers.DeleteProduct)
	e.GET("/products", handlers.GetProducts)

	e.POST("/order", handlers.AddOrder)

	e.Start(":" + port)
}
