import * as d3 from "d3";

// This relies on observable's (unique?) input system that uses the keyword: viewof
// We can return the html for the scrollytelling and access the current scrolled to event by accessing the cell's value.
export const ScrollingSvg = (
  selector,
  descriptions,
  width = 600,
  height = 500,
  timeline = true,
) => {
  // We add supplementary events either end of the array to allow all actual events to be reached by scrolling
  const descStartEnd = [
    { description: "" },
    { description: "Scroll right to begin animation." },
  ]
    .concat(descriptions)
    .concat({ description: "" });

  // Div containing the entire vis
  const visContainer = d3
    .select(selector)
    //.create("div")
    .append("div")
    .attr("class", "vis-container")
    .style("width", width + "px")
    .style("height", height + "px");

  // Since div is also an input we must set its value
  visContainer.node().value = { event: 0 };
  visContainer.node().dispatchEvent(new Event("input", { bubbles: true }));

  // Svg to be drawn on by graph
  const graphContainer = visContainer
    .append("svg")
    .attr("width", width)
    .attr("height", height - (timeline ? 150 : 100)) // -200 to make space for scroll section & timeline
    .attr("id", "graphSvg");

  visContainer.node().value.graphSvg = graphContainer.node();

  if (timeline) {
    const timelineContainer = visContainer
      .append("svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "timelineSvg");

    visContainer.node().value.timelineSvg = timelineContainer.node();
  }

  // Scrollable div for progressing animation
  const scrollContainer = visContainer
    .append("div")
    .attr("dir", "ltr")
    .attr("class", "scroll-container");

  // Create a scrollable event per entry in descriptions
  scrollContainer
    .selectAll(".event")
    .data(descStartEnd)
    .join("div")
    .attr("class", "event")
    .style(
      "opacity",
      (_, i) => (i == visContainer.node().value.event + 1 ? 1 : 0.3), // Only the currently central event is opaque
    )
    .html((d) => `<h5>${d.date || ""}</h5>${d.description || ""}`);

  const updateAnimation = () => {
    // Calculate which event is selected using size of a description section and scroll value
    const sectionSize = width / 3;
    visContainer.node().value.event = Math.round(
      scrollContainer.node().scrollLeft / sectionSize,
    );
    visContainer.node().dispatchEvent(new Event("input", { bubbles: true }));

    // Set opacity depending on which event is in focus
    scrollContainer
      .selectAll(".event")
      .style("opacity", (_, i) =>
        i == visContainer.node().value.event + 1 ? 1 : 0.3,
      );
  };

  // Need to only trigger animation update only when scrolling is finished
  let timer;
  scrollContainer.on("scroll", (e) => {
    clearTimeout(timer);
    timer = setTimeout(updateAnimation, 500);
  });

  return visContainer.node();
};
