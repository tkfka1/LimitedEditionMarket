// models/product.go

package models

type Product struct {
	ID          int     `json:"id"`
	ProductName string  `json:"productName" form:"productName" query:"productName"`
	Description string  `json:"description" form:"description" query:"description"`
	Price       float64 `json:"price" form:"price" query:"price"`
	Image       string  `json:"image" form:"image" query:"image"`
}
