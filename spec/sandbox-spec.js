describe("Jasmine DOM matchers", function() {

  describe("sandbox", function() {
    it("is jQuery element", function() {
      expect(jasmine.sandbox.jquery).toBeDefined();
    });

    it("is initially empty", function() {
      expect(jasmine.sandbox).toBeEmpty();
      jasmine.sandbox.html("<div>Some text</div>");
    });

    it("is empty after prev step", function() {
      expect(jasmine.sandbox).toBeEmpty();
    });
  });
});
