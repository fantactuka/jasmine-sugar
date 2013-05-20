describe("Jasmine DOM matchers", function() {
  describe("fixture", function() {
    it("loads json", function() {
      expect(jasmine.fixture("spec.json")).toEqual({ name: "John" });
    });

    it("loads html", function() {
      expect(jasmine.fixture("spec.html")).toEqual("<div>Hello!</div>");
    });
  });
});
