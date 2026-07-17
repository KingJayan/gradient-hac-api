package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/iancoleman/orderedmap"
)

var app *gin.Engine

func init() {
	gin.SetMode(gin.ReleaseMode)
	app = gin.New()
	app.Use(gin.Recovery())

	message := orderedmap.New()
	message.Set("title", "Welcome to the Home Access Center API!")
	message.Set("message", "This is the home page, visit the documentation at https://gradient-hac-api-docs.vercel.app/ for more information on how to use this API.")
	message.Set("routes", []string{"/api/name", "/api/assignments", "/api/info", "/api/averages", "/api/classes", "/api/reportcard", "/api/ipr", "/api/transcript", "/api/rank"})

	home := func(c *gin.Context) { c.JSON(200, message) }
	app.GET("/", home)

	r := app.Group("/api")
	r.GET("/", home)
	r.GET("/help", home)
	r.GET("/admin", func(c *gin.Context) { c.String(http.StatusOK, "ok") })

	r.POST("/name", getName)
	r.POST("/assignments", getAssignments)
	r.POST("/info", getInfo)
	r.POST("/averages", getAverages)
	r.POST("/classes", getClasses)
	r.POST("/reportcard", getReport)
	r.POST("/ipr", getProgressReport)
	r.POST("/transcript", getTranscript)
	r.POST("/rank", getRank)
}

func Handler(w http.ResponseWriter, r *http.Request) {
	app.ServeHTTP(w, r)
}
