package models

import (
	"sort"
	"time"
)

type Product struct {
	ID               int       `json:"id"`
	ProductName      string    `json:"productName" form:"productName" query:"productName"`
	Description      string    `json:"description" form:"description" query:"description"`
	Price            int64     `json:"price" form:"price" query:"price"`
	Image            string    `json:"image" form:"image" query:"image"`
	UserId           int       `json:"userId" form:"userId" query:"userId"`
	SaleStart        time.Time `json:"saleStart" form:"saleStart" query:"saleStart"`
	SaleEnd          time.Time `json:"saleEnd" form:"saleEnd" query:"saleEnd"`
	IsOnSale         bool      `json:"isOnSale"`
	ExpectedPurchase string    `json:"expectedPurchase" form:"expectedPurchase" query:"expectedPurchase"`
	Popularity       int       `json:"popularity" form:"popularity" query:"popularity"`
}

func GetAllProducts() ([]Product, error) {
	rows, err := Db.Query("SELECT id, productName, description, price, image, userId, saleStart, saleEnd, expectedPurchase, popularity FROM products ORDER BY id DESC")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var products []Product

	layout := "2006-01-02 15:04:05" // MySQL DATETIME format
	now := time.Now()               // Calculate current time only once

	for rows.Next() {
		var product Product
		var saleStartStr, saleEndStr string

		// Scanning saleStart and saleEnd into strings
		err = rows.Scan(&product.ID, &product.ProductName, &product.Description, &product.Price, &product.Image, &product.UserId, &saleStartStr, &saleEndStr, &product.ExpectedPurchase, &product.Popularity)
		if err != nil {
			return nil, err
		}

		// Parsing the strings into time.Time
		product.SaleStart, err = time.Parse(layout, saleStartStr)
		if err != nil {
			return nil, err
		}
		product.SaleEnd, err = time.Parse(layout, saleEndStr)
		if err != nil {
			return nil, err
		}

		product.IsOnSale = now.After(product.SaleStart) && now.Before(product.SaleEnd)
		products = append(products, product)
	}

	// Sort products based on sale status
	sort.Slice(products, func(i, j int) bool {
		// If both products are on sale or both products are not on sale, sort by product ID
		if products[i].IsOnSale == products[j].IsOnSale {
			return products[i].ID < products[j].ID
		}

		// If only one of the products is on sale, put that product first
		if products[i].IsOnSale {
			return true
		}
		if products[j].IsOnSale {
			return false
		}

		// If neither product is on sale, put the product that has a sale starting soonest first
		if now.Before(products[i].SaleStart) && now.Before(products[j].SaleStart) {
			return products[i].SaleStart.Before(products[j].SaleStart)
		}

		// Otherwise, sort by sale end time, with products that ended their sale more recently first
		return products[i].SaleEnd.After(products[j].SaleEnd)
	})

	return products, nil
}
