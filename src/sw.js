self.addEventListener("fetch", (event) => {
  console.log(`Fetch: ${event.request.url}`);
});
