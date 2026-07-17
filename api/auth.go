package api

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gocolly/colly"
)

var errBadLogin = errors.New("invalid username or password")

const userAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36"

func newCollector() *colly.Collector {
	c := colly.NewCollector()
	c.UserAgent = userAgent
	c.SetRequestTimeout(15 * time.Second)
	return c
}

type creds struct {
	user, pass, link, session string
}

func getCreds(c *gin.Context) creds {
	cr := creds{
		user:    c.PostForm("user"),
		pass:    c.PostForm("pass"),
		link:    c.PostForm("link"),
		session: c.GetHeader("X-HAC-Session"),
	}
	if cr.user == "" && cr.pass == "" {
		var body struct {
			User    string `json:"user"`
			Pass    string `json:"pass"`
			Link    string `json:"link"`
			Session string `json:"session"`
		}
		if err := c.ShouldBindJSON(&body); err == nil {
			cr.user, cr.pass = body.User, body.Pass
			if cr.link == "" {
				cr.link = body.Link
			}
			if cr.session == "" {
				cr.session = body.Session
			}
		}
	}
	if cr.user == "" {
		if u, p, ok := c.Request.BasicAuth(); ok {
			cr.user, cr.pass = u, p
		}
	}
	if cr.link == "" {
		cr.link = c.GetHeader("X-HAC-Link")
	}
	if cr.link == "" {
		cr.link = "https://homeaccess.roundrockisd.org"
	}
	cr.link = strings.TrimSuffix(cr.link, "/")
	return cr
}

func login(username, password, link string) (*colly.Collector, error) {
	loginLink := link + "/HomeAccess/Account/LogOn"
	c := newCollector()

	loginData := map[string]string{
		"VerificationOption": "UsernamePassword",
	}
	attempted := false
	success := false

	c.OnHTML("form input", func(e *colly.HTMLElement) {
		if name := e.Attr("name"); name != "" && !attempted {
			loginData[name] = e.Attr("value")
		}
	})
	c.OnHTML("form select", func(e *colly.HTMLElement) {
		if name := e.Attr("name"); name != "" && !attempted && loginData[name] == "" {
			if v := e.ChildAttr("option[selected]", "value"); v != "" {
				loginData[name] = v
			} else {
				loginData[name] = e.ChildAttr("option", "value")
			}
		}
	})
	c.OnResponse(func(r *colly.Response) {
		if attempted {
			success = !strings.Contains(r.Request.URL.String(), "LogOn")
		}
	})
	c.OnScraped(func(r *colly.Response) {
		if !attempted {
			attempted = true
			loginData["LogOnDetails.UserName"] = username
			loginData["LogOnDetails.Password"] = password
			c.Post(loginLink, loginData)
		}
	})

	if err := c.Visit(loginLink); err != nil {
		return nil, err
	}
	if !success {
		return nil, errBadLogin
	}
	return c, nil
}

func sessionString(c *colly.Collector, link string) string {
	var parts []string
	for _, ck := range c.Cookies(link) {
		parts = append(parts, ck.Name+"="+ck.Value)
	}
	return strings.Join(parts, "; ")
}

func setSession(c *colly.Collector, link, session string) {
	var cookies []*http.Cookie
	for _, p := range strings.Split(session, "; ") {
		if kv := strings.SplitN(p, "=", 2); len(kv) == 2 {
			cookies = append(cookies, &http.Cookie{Name: kv[0], Value: kv[1]})
		}
	}
	c.SetCookies(link, cookies)
}

func withLogin(c *gin.Context) (*colly.Collector, string, bool) {
	cr := getCreds(c)
	if cr.session != "" {
		col := newCollector()
		setSession(col, cr.link, cr.session)
		return col, cr.link, true
	}
	col, err := login(cr.user, cr.pass, cr.link)
	if errors.Is(err, errBadLogin) {
		c.JSON(401, gin.H{"error": "Invalid username or password"})
		return nil, "", false
	}
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to log in"})
		return nil, "", false
	}
	c.Header("X-HAC-Session", sessionString(col, cr.link))
	return col, cr.link, true
}

func scrape(col *colly.Collector, link, page string) error {
	loggedOut := false
	col.OnResponse(func(r *colly.Response) {
		if strings.Contains(r.Request.URL.String(), "LogOn") {
			loggedOut = true
		}
	})
	if err := col.Visit(link + page); err != nil {
		return err
	}
	if loggedOut {
		return errBadLogin
	}
	return nil
}

func finish(c *gin.Context, err error, payload interface{}) {
	if errors.Is(err, errBadLogin) {
		c.JSON(401, gin.H{"error": "Invalid or expired session"})
		return
	}
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to scrape data"})
		return
	}
	c.JSON(200, payload)
}
