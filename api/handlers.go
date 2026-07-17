package api

import (
	"strings"

	"github.com/PuerkitoBio/goquery"
	"github.com/gin-gonic/gin"
	"github.com/gocolly/colly"
	"github.com/iancoleman/orderedmap"
)

func parseClassHeader(header, heading string) (string, string) {
	fields := strings.Fields(header)
	class := ""
	if len(fields) > 6 {
		class = strings.Join(fields[3:len(fields)-3], " ")
	}
	average := ""
	if len(heading) > 18 {
		average = strings.TrimSpace(heading[18:])
	}
	return class, average
}

func getName(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}
	name := ""
	collector.OnHTML("div.sg-banner-menu-container", func(e *colly.HTMLElement) {
		if name == "" {
			name = e.ChildText("span")
		}
	})
	err := scrape(collector, link, "/HomeAccess/Classes/Classwork")
	finish(c, err, gin.H{"name": name})
}

func getAssignments(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}

	classes := make([]string, 0)
	averages := make([]string, 0)
	assignments := make([][][]string, 0)
	categories := make([][][]string, 0)

	collector.OnHTML("div.AssignmentClass", func(e *colly.HTMLElement) {
		class, average := parseClassHeader(e.ChildText("div.sg-header"), e.ChildText("span.sg-header-heading"))
		classes = append(classes, class)
		averages = append(averages, average)

		table := e.DOM.Find("table.sg-asp-table")
		if table.Length() > 0 {
			table.Each(func(_ int, j *goquery.Selection) {
				assignmentstable := make([][]string, 0)
				j.Find("tr").Each(func(_ int, row *goquery.Selection) {
					assignmentsrow := make([]string, 0)
					row.Find("td").Each(func(_ int, element *goquery.Selection) {
						text := strings.ReplaceAll(strings.TrimSpace(element.Text()), "*", "")
						assignmentsrow = append(assignmentsrow, text)
					})
					assignmentstable = append(assignmentstable, assignmentsrow)
				})
				if strings.Contains(j.AttrOr("id", ""), "CourseCategories") {
					categories = append(categories, assignmentstable)
				} else if strings.Contains(j.AttrOr("id", ""), "CourseAssignments") {
					assignments = append(assignments, assignmentstable)
				}
			})
		}
		for len(assignments) < len(classes) {
			assignments = append(assignments, [][]string{})
		}
		for len(categories) < len(classes) {
			categories = append(categories, [][]string{})
		}
	})

	err := scrape(collector, link, "/HomeAccess/Content/Student/Assignments.aspx")
	ret := make(map[string]interface{})
	for i := 0; i < len(classes); i++ {
		ret[classes[i]] = map[string]interface{}{
			"average":     averages[i],
			"assignments": assignments[i],
			"categories":  categories[i],
		}
	}
	finish(c, err, ret)
}

func getInfo(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}
	ret := make(map[string]interface{})
	collector.OnHTML("div.sg-main-content", func(e *colly.HTMLElement) {
		if name := e.ChildText("#plnMain_lblRegStudentName"); name != "" {
			ret["name"] = strings.TrimSpace(name)
			ret["grade"] = strings.TrimSpace(e.ChildText("#plnMain_lblGrade"))
			ret["school"] = strings.TrimSpace(e.ChildText("#plnMain_lblBuildingName"))
			ret["dob"] = strings.TrimSpace(e.ChildText("#plnMain_lblBirthDate"))
			ret["counselor"] = strings.TrimSpace(e.ChildText("#plnMain_lblCounselor"))
			ret["language"] = strings.TrimSpace(e.ChildText("#plnMain_lblLanguage"))
			ret["cohort-year"] = strings.TrimSpace(e.ChildText("#plnMain_lblCohortYear"))
		}
	})
	err := scrape(collector, link, "/HomeAccess/Content/Student/Registration.aspx")
	finish(c, err, ret)
}

func getAverages(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}
	ret := orderedmap.New()
	collector.OnHTML("div.AssignmentClass", func(e *colly.HTMLElement) {
		class, average := parseClassHeader(e.ChildText("div.sg-header"), e.ChildText("span.sg-header-heading"))
		ret.Set(class, average)
	})
	err := scrape(collector, link, "/HomeAccess/Content/Student/Assignments.aspx")
	finish(c, err, ret)
}

func getClasses(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}
	classes := make([]string, 0)
	collector.OnHTML("div.AssignmentClass", func(e *colly.HTMLElement) {
		class, _ := parseClassHeader(e.ChildText("div.sg-header"), e.ChildText("span.sg-header-heading"))
		classes = append(classes, class)
	})
	err := scrape(collector, link, "/HomeAccess/Content/Student/Assignments.aspx")
	finish(c, err, classes)
}

func getReport(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}

	finalData := orderedmap.New()
	finalData.Set("headers", []string{"Course", "Description", "Period", "Teacher", "Room", "1st", "2nd", "3rd", "Exam1", "Sem1", "4th", "5th", "6th", "Exam2", "Sem2", "CND1", "CND2", "CND3", "CND4", "CND5", "CND6"})

	var row []string
	var data [][]string
	counter := 0

	collector.OnHTML("td", func(e *colly.HTMLElement) {
		counter++
		if counter > 32 {
			row = append(row, strings.TrimSpace(e.Text))
		}
		if len(row)%32 == 0 && counter > 32 {
			data = append(data, row)
			row = nil
		}
	})

	err := scrape(collector, link, "/HomeAccess/Content/Student/ReportCards.aspx")
	for i := range data {
		if len(data[i]) >= 32 {
			data[i] = append(data[i][:23], data[i][32:]...)
			data[i] = append(data[i][:5], data[i][7:]...)
		}
	}
	finalData.Set("data", data)
	finish(c, err, finalData)
}

func getProgressReport(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}

	var data [][]string
	collector.OnHTML("tr", func(e *colly.HTMLElement) {
		var row []string
		e.ForEach("td", func(_ int, el *colly.HTMLElement) {
			row = append(row, strings.TrimSpace(el.Text))
		})
		data = append(data, row)
	})

	err := scrape(collector, link, "/HomeAccess/Content/Student/InterimProgress.aspx")
	if err != nil || len(data) == 0 {
		finish(c, err, nil)
		return
	}

	finalData := orderedmap.New()
	finalData.Set("headers", data[0])
	finalData.Set("data", data[1:])
	finish(c, nil, finalData)
}

func attachGPA(collector *colly.Collector, out *orderedmap.OrderedMap) {
	collector.OnHTML("table#plnMain_rpTranscriptGroup_tblCumGPAInfo", func(e *colly.HTMLElement) {
		e.ForEach("tbody > tr.sg-asp-table-data-row", func(_ int, el *colly.HTMLElement) {
			var text, value string
			el.ForEach("td > span", func(_ int, el2 *colly.HTMLElement) {
				id := el2.Attr("id")
				switch {
				case strings.Contains(id, "GPADescr"):
					text = el2.Text
				case strings.Contains(id, "GPACum"):
					value = el2.Text
				case strings.Contains(id, "GPARank"):
					out.Set("rank", el2.Text)
				case strings.Contains(id, "GPAQuartile"):
					out.Set("quartile", el2.Text)
				}
			})
			if text != "" {
				out.Set(text, value)
			}
		})
	})
}

func getTranscript(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}

	transcript := orderedmap.New()

	collector.OnHTML("td.sg-transcript-group", func(e *colly.HTMLElement) {
		semester := orderedmap.New()

		e.ForEach("table > tbody > tr > td > span", func(_ int, el *colly.HTMLElement) {
			id := el.Attr("id")
			switch {
			case strings.Contains(id, "YearValue"):
				semester.Set("year", el.Text)
			case strings.Contains(id, "GroupValue"):
				semester.Set("semester", el.Text)
			case strings.Contains(id, "GradeValue"):
				semester.Set("grade", el.Text)
			case strings.Contains(id, "BuildingValue"):
				semester.Set("school", el.Text)
			}
		})

		finaldata := make([][]string, 0)
		e.ForEach("table:nth-child(2) > tbody > tr", func(_ int, el *colly.HTMLElement) {
			if strings.Contains(el.Attr("class"), "sg-asp-table-header-row") ||
				strings.Contains(el.Attr("class"), "sg-asp-table-data-row") {
				data := make([]string, 0)
				el.ForEach("td", func(_ int, el2 *colly.HTMLElement) {
					data = append(data, el2.Text)
				})
				finaldata = append(finaldata, data)
			}
		})
		semester.Set("data", finaldata)

		e.ForEach("table:nth-child(3) > tbody > tr > td > label", func(_ int, el *colly.HTMLElement) {
			if strings.Contains(el.Attr("id"), "CreditValue") {
				semester.Set("credits", el.Text)
			}
		})

		year, _ := semester.Get("year")
		semesterNum, _ := semester.Get("semester")
		y, _ := year.(string)
		s, _ := semesterNum.(string)
		transcript.Set(y+" - Semester "+s, semester)
	})

	attachGPA(collector, transcript)

	err := scrape(collector, link, "/HomeAccess/Content/Student/Transcript.aspx")
	finish(c, err, transcript)
}

func getRank(c *gin.Context) {
	collector, link, ok := withLogin(c)
	if !ok {
		return
	}
	ret := orderedmap.New()
	attachGPA(collector, ret)
	err := scrape(collector, link, "/HomeAccess/Content/Student/Transcript.aspx")
	finish(c, err, ret)
}
