// Always open the page at the top on load/reload:
// stop the browser restoring the old scroll position, and drop any #section
// left in the URL by the menu links so it doesn't jump there.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);

// Embed every chart marked with data-spec="<file in specs/>".
// The specs use data URLs like "../data/x.csv" (relative to the specs folder),
// so we resolve data relative to specs/ to keep them working unchanged.
const loader = vega.loader({ baseURL: "specs/" });

const embedOpts = {
  actions: false,
  renderer: "svg",
  loader: loader,
  config: {
    font: "Inter, system-ui, sans-serif",
    title: { fontSize: 16, subtitleFontSize: 12, subtitleColor: "#666", anchor: "start", offset: 12 },
    axis: { labelFontSize: 11, titleFontSize: 12, titleColor: "#444", labelColor: "#555" },
    legend: { labelFontSize: 11, titleFontSize: 12 }
  }
};

document.querySelectorAll(".chart[data-spec]").forEach((el) => {
  const spec = el.dataset.spec;   
  vegaEmbed(el, spec, embedOpts).then(() => {
    // Size the chart in "design pixels" so it scales with the page (see style.css).
    const svg = el.querySelector("svg");
    if (svg) svg.style.width = "calc(" + svg.getAttribute("width") + " * var(--chart-u))";
  }).catch((err) => {
    console.error(spec, err);
    el.innerHTML = '<p class="chart-error">Could not load ' + spec + " — " + err.message + "</p>";
  });
});

