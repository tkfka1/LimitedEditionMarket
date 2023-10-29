package models

import (
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

type User struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

var Db *sql.DB

func InitDB(dsn string) {
	var err error
	Db, err = sql.Open("mysql", dsn)
	if err != nil {
		panic(err)
	}

	if err = Db.Ping(); err != nil {
		panic(err)
	}
}
