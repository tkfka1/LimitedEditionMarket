package utils

import "github.com/spf13/viper"

func LoadConfig() {
	viper.SetConfigName("config")
	viper.AddConfigPath(".")
	if err := viper.ReadInConfig(); err != nil {
		panic("Error loading config")
	}
}
