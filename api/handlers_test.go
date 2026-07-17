package api

import "testing"

func TestParseClassHeader(t *testing.T) {
	class, avg := parseClassHeader("MATH0101 - 1 AP Calculus AB Period 2 MWF", "Class work Average 98.5")
	if class != "AP Calculus AB" {
		t.Errorf("class = %q", class)
	}
	if avg != "98.5" {
		t.Errorf("avg = %q", avg)
	}
}

func TestParseClassHeaderShortInput(t *testing.T) {
	class, avg := parseClassHeader("short", "avg")
	if class != "" || avg != "" {
		t.Errorf("expected empty, got %q %q", class, avg)
	}
}
