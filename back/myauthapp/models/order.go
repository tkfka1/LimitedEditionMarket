package models

import (
	"database/sql"
)

type Order struct {
	ID         int    `json:"id"`
	OrderID    string `json:"orderId"`
	OrderName  string `json:"orderName"`
	Amount     int64  `json:"amount"`
	CustomerID int    `json:"customerId"`
}

func AddOrder(order Order) (sql.Result, error) {
	stmt, err := Db.Prepare("INSERT INTO orders (orderId, orderName, amount, customerId) VALUES (?, ?, ?, ?)")
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	return stmt.Exec(order.OrderID, order.OrderName, order.Amount, order.CustomerID)
}
