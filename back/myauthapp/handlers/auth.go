package handlers

import (
	"database/sql"
	"fmt"
	"myauthapp/models"
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c echo.Context) error {

	// 1. 사용자 데이터 바인딩
	user := &models.User{}
	if err := c.Bind(user); err != nil {
		fmt.Printf("Error binding user: %v\n", err) // 로깅
		return echo.NewHTTPError(http.StatusBadRequest, "Invalid data.")
	}

	fmt.Printf("Bound User Data - Username: %s, Email: %s, Password: %s\n", user.Username, user.Email, user.Password)

	// 2. 이메일 중복 확인
	var exists int
	err := models.Db.QueryRow("SELECT COUNT(*) FROM users WHERE email=?", user.Email).Scan(&exists)
	if err != nil {
		fmt.Printf("Error checking email: %v\n", err) // 로깅
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to check email.")
	}
	if exists > 0 {
		return echo.NewHTTPError(http.StatusBadRequest, "Email already in use.")
	}

	// 3. 비밀번호 해싱
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err) // 로깅
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not hash the password.")
	}

	// 4. 사용자 데이터 삽입
	_, err = models.Db.Exec("INSERT INTO users(username, password, email) VALUES(?, ?, ?)", user.Username, string(hashedPassword), user.Email)
	if err != nil {
		fmt.Printf("Error inserting user: %v\n", err) // 로깅
		return echo.NewHTTPError(http.StatusInternalServerError, "Failed to register user.")
	}

	// 데이터 삽입 후 로깅
	fmt.Printf("User registered with Username: %s, Email: %s, Hashed Password: %s\n", user.Username, user.Email, string(hashedPassword))

	// 5. 회원가입 성공 응답
	return c.JSON(http.StatusOK, map[string]string{"message": "Registered!"})

}

func Login(c echo.Context) error {
	user := &models.User{}
	if err := c.Bind(user); err != nil {
		return err
	}

	fmt.Printf("Bound User Data - Username: %s, Password: %s\n", user.Username, user.Password)

	// userRank를 받아오도록 SQL 쿼리 업데이트
	row := models.Db.QueryRow("SELECT id, username, email, password, userRank FROM users WHERE username=?", user.Username)
	var retrievedPassword, retrievedUsername, retrievedEmail string
	var id, userRank int                                                                                      // userRank 변수 추가
	if err := row.Scan(&id, &retrievedUsername, &retrievedEmail, &retrievedPassword, &userRank); err != nil { // userRank 스캔 추가
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusUnauthorized, "Username or password is incorrect.")
		}
		return err
	}

	err := bcrypt.CompareHashAndPassword([]byte(retrievedPassword), []byte(user.Password))
	if err == bcrypt.ErrMismatchedHashAndPassword {
		// This error means the password was incorrect
		return echo.NewHTTPError(http.StatusUnauthorized, "Password is incorrect.")
	} else if err != nil {
		// Any other error
		fmt.Printf("Error comparing password hash: %v\n", err) // Logging the error for diagnosis
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error.")
	}

	token, err := createJWTToken(id)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, "Could not generate the token.")
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"token": token,
		"user": map[string]interface{}{
			"id":       id,
			"username": retrievedUsername,
			"email":    retrievedEmail,
			"userRank": userRank,
		},
	})
}

func Profile(c echo.Context) error {
	userId := c.Param("id")
	if userId == "" {
		return echo.NewHTTPError(http.StatusBadRequest, "User ID is required.")
	}

	var userProfile models.User
	row := models.Db.QueryRow("SELECT id, username, email FROM users WHERE id=?", userId)
	err := row.Scan(&userProfile.ID, &userProfile.Username, &userProfile.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			return echo.NewHTTPError(http.StatusNotFound, "User not found.")
		}
		return echo.NewHTTPError(http.StatusInternalServerError, "Internal server error.")
	}

	return c.JSON(http.StatusOK, userProfile)
}

func createJWTToken(userID int) (string, error) {
	claims := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
	})

	return claims.SignedString([]byte("your_secret_key"))
}
