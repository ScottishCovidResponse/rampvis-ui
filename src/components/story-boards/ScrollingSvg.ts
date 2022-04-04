import * as d3 from "d3";

// This relies on observable's (unique?) input system that uses the keyword: view of
// We can return the html for the scrollytelling and access the current scrolled to event by accessing the cell's value.
export class ScrollingSvg {
  width: number;
  container: any;
  scrollContainer: any;

  constructor(
    selector,
    descriptions,
    width = 600,
    height = 500,
    timeline = true,
    onScrollCallback = undefined,
  ) {
    this.width = width;

    // We add supplementary events either end of the array to allow all actual events to be reached by scrolling
    const descriptionStartEnd = [
      { description: "" },
      { description: "Scroll right to begin animation." },
    ]
      .concat(descriptions)
      .concat({ description: "" });

    // Div containing the entire vis
    this.container = d3
      .select(selector)
      .append("div")
      .attr("class", "vis-container")
      .style("width", width + "px")
      .style("height", height + "px");

    // Since div is also an input we must set its value
    this.container.node().value = { event: 0 };
    this.container.node().dispatchEvent(new Event("input", { bubbles: true }));

    // Svg to be drawn on by graph
    this.container
      .append("svg")
      .attr("width", width)
      .attr("height", height - (timeline ? 190 : 140)) // -200 to make space for scroll section & timeline
      .attr("id", "graphSvg");

    if (timeline) {
      this.container
        .append("svg")
        .attr("width", width)
        .attr("height", 50)
        .attr("id", "timelineSvg");
    }

    // Scrollable div for progressing animation
    this.scrollContainer = this.container
      .append("div")
      .attr("dir", "ltr")
      .attr("class", "scroll-container")
      .attr("id", "scrollContainer");

    // Create a scrollable event per entry in descriptions
    this.scrollContainer
      .selectAll(".event")
      .data(descriptionStartEnd)
      .join("div")
      .attr("class", "event")
      .style(
        "opacity",
        (_, i) => {
          const val = i == this.container.node().value.event + 1 ? 1 : 0.3;
          // prettier-ignore
          // console.log("ScrollingSvg: 1 opacity, visContainer.node().value.event", visContainer.node().value.event,"val = ", val);
          return val;
        }, // Only the currently central event is opaque
      )
      .html((d) => `<h5>${d.date || ""}</h5>${d.description || ""}`);

    const updateAnimation = () => {
      this.clear();

      console.log("scrollingSvg: updateAnimation");
      // Calculate which event is selected using size of a description section and scroll value
      const sectionSize = width / 3;
      console.log(
        "scrollingSvg: scrollLeft ",
        this.scrollContainer.node().scrollLeft,
        ", sectionSize",
        sectionSize,
      );

      this.container.node().value.event = Math.round(
        this.scrollContainer.node().scrollLeft / sectionSize,
      );
      this.container
        .node()
        .dispatchEvent(new Event("input", { bubbles: true }));

      // Set opacity depending on which event is in focus
      this.scrollContainer.selectAll(".event").style("opacity", (_, i) => {
        const val = i == this.container.node().value.event + 1 ? 1 : 0.3;
        // prettier-ignore
        // console.log("ScrollingSvg: 2 opacity, visContainer.node().value.event", visContainer.node().value.event,"val = ", val);
        return val;
      });

      onScrollCallback(this.container.node().value.event);
    };

    // Need to only trigger animation update only when scrolling is finished
    let timer;
    this.scrollContainer.on("scroll", (e) => {
      // console.log("ScrollingSvg: scroll event");
      clearTimeout(timer);
      timer = setTimeout(updateAnimation, 500);
    });
  }

  get timeseriesContainer() {
    return this.container.select("#graphSvg").node();
  }
  get timelineContainer() {
    return this.container.select("#timelineSvg").node();
  }

  clear() {
    this.container.select("#graphSvg").selectAll("*").remove();
    this.container.select("#timelineSvg").selectAll("*").remove();
  }

  updateCounter(counter) {
    this.clear();

    this.container.node().value.event = counter;
    this.container.node().dispatchEvent(new Event("input", { bubbles: true }));
    this.scrollContainer.node().scrollLeft = counter * (this.width / 3);

    // Set opacity depending on which event is in focus
    this.scrollContainer.selectAll(".event").style("opacity", (_, i) => {
      const val = i == this.container.node().value.event + 1 ? 1 : 0.3;
      return val;
    });
  }
}
